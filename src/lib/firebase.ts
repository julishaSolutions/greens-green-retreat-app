
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

// This configuration uses environment variables provided by Next.js.
// It's crucial that these variables are defined in your .env.local file.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

// Initialize Firebase
if (getApps().length === 0) {
  // Check if all required config values are present
  if (
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  ) {
     try {
        app = initializeApp(firebaseConfig);
    } catch (e) {
        console.error("Failed to initialize client-side Firebase", e);
    }
  } else {
    console.warn("Firebase client config is incomplete. Check your NEXT_PUBLIC_ environment variables.");
  }
 
} else {
  app = getApp();
}

if (app) {
    try {
        db = getFirestore(app);
        auth = getAuth(app);
    } catch (e) {
        console.error("Failed to get Firestore or Auth instances", e)
    }
}

export { app, db, auth };
