import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBk37RLP60xQx-h5GJVVcvdickdMpJoSio",
  authDomain: "seismic-timing-kms1d.firebaseapp.com",
  projectId: "seismic-timing-kms1d",
  storageBucket: "seismic-timing-kms1d.firebasestorage.app",
  messagingSenderId: "806168011637",
  appId: "1:806168011637:web:1adfc102c21f8919fae93c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
// Use the specific firestoreDatabaseId from the config
const db = getFirestore(app, "ai-studio-neuralops-1f295512-899b-4786-a049-58ebf449b102");

async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export { app, auth, googleProvider, db };
