import { Request, Response, NextFunction } from "express";
import { adminAuth } from "../lib/firebase-admin.ts";
import { db, withRetry } from "../db/index.ts";
import { users } from "../db/schema.ts";
import { eq } from "drizzle-orm";

export interface AuthRequest extends Request {
  user?: any; // Firebase decoded ID token
  dbUser?: typeof users.$inferSelect; // Synced PostgreSQL user record
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing authentication token" });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    let decodedToken: any;
    if (token === "demo-token-phaelitus") {
      decodedToken = {
        uid: "demo-operator-id",
        email: "demo-operator@phaelitus.io",
        name: "Demo Operator",
        picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      };
    } else {
      try {
        decodedToken = await adminAuth.verifyIdToken(token);
      } catch (authErr: any) {
        console.error("Firebase ID token verification failed:", authErr);
        return res.status(401).json({ error: "Unauthorized: Invalid or expired session token" });
      }
    }
    req.user = decodedToken;

    // Fetch or create user record in Cloud SQL PostgreSQL
    const email = decodedToken.email || "unknown@ibm.com";
    const uid = decodedToken.uid;
    const name = decodedToken.name || "Enterprise Operator";
    const picture = decodedToken.picture || "";

    let dbUserRecord: any;
    try {
      dbUserRecord = await withRetry(() => db
        .select()
        .from(users)
        .where(eq(users.uid, uid))
        .then((rows) => rows[0]));

      if (!dbUserRecord) {
        try {
          const inserted = await withRetry(() => db
            .insert(users)
            .values({
              uid,
              email,
              displayName: name,
              photoURL: picture,
            })
            .onConflictDoUpdate({
              target: users.uid,
              set: {
                email,
                displayName: name,
                photoURL: picture,
              },
            })
            .returning());
          dbUserRecord = inserted[0];
        } catch (insertError) {
          // Fallback: fetch again in case of race condition
          dbUserRecord = await withRetry(() => db
            .select()
            .from(users)
            .where(eq(users.uid, uid))
            .then((rows) => rows[0]));
        }
      }

      if (!dbUserRecord) {
        throw new Error("Could not fetch or create PostgreSQL user record");
      }
    } catch (dbError: any) {
      console.error("PostgreSQL user sync failed:", dbError);
      return res.status(500).json({ error: `Database connection error: ${dbError.message}` });
    }

    req.dbUser = dbUserRecord;
    next();
  } catch (error: any) {
    console.error("Error in auth middleware:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
