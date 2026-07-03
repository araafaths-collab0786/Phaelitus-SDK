import { pgTable, serial, text, integer, doublePrecision, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table matching the Firebase Authentication UID
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase Auth UID
  email: text("email").notNull(),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Incidents table for tactical event streams (MLOps / IBM Watsonx.ai / general drift alerts)
export const incidents = pgTable("incidents", {
  id: text("id").primaryKey(), // Unique alphanumeric string e.g., inc-123456
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  severity: text("severity").notNull(), // resolved, warning, critical
  statusText: text("status_text").notNull(), // PROTOCOL_READY, DRIFT_HIGH, Retraining, etc.
  timestamp: text("timestamp").notNull(), // e.g., 14:15:33
  title: text("title").notNull(), // main title
  subtext: text("subtext"), // feature code or sub-headline
  description: text("description"), // longer human-readable text
  model: text("model").notNull(), // watsonx-gateway, price-predictor, etc.
  metric: text("metric").notNull(), // KL-Divergence, P99 Latency, etc.
  score: doublePrecision("score"), // numerical score e.g., 0.88
  feature: text("feature"), // specific feature affected e.g., user_intent_embedding
  logs: text("logs").notNull(), // full system telemetry logs
  createdAt: timestamp("created_at").defaultNow(),
});

// Policies table for Kubernetes operator and gating metrics
export const policies = pgTable("policies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(), // One policy set per user
  psiThreshold: doublePrecision("psi_threshold").default(0.20).notNull(),
  canaryLatency: integer("canary_latency").default(50).notNull(),
  autoMitigate: boolean("auto_mitigate").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relationship mappings for Drizzle
export const usersRelations = relations(users, ({ many, one }) => ({
  incidents: many(incidents),
  policy: one(policies, {
    fields: [users.id],
    references: [policies.userId],
  }),
}));

export const incidentsRelations = relations(incidents, ({ one }) => ({
  user: one(users, {
    fields: [incidents.userId],
    references: [users.id],
  }),
}));

export const policiesRelations = relations(policies, ({ one }) => ({
  user: one(users, {
    fields: [policies.userId],
    references: [users.id],
  }),
}));
