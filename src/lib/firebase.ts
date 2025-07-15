import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

// Hardcoded Firebase configuration for project ggr1-4fa1c
// This is the most reliable way to ensure the build process can find the configuration.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ggr1-4fa1c.firebaseapp.com",
  projectId: "ggr1-4fa1c",
  storageBucket: "ggr1-4fa1c.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

// The check for apiKey is still here because it's the one value that can vary.
if (!firebaseConfig.apiKey) {
    console.warn("Firebase client configuration is incomplete. NEXT_PUBLIC_FIREBASE_API_KEY is missing. Client-side Firebase features will be disabled. Please check your environment variables.");
} else {
    try {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        db = getFirestore(app);
        auth = getAuth(app);
    } catch (e) {
        console.error("Failed to initialize client-side Firebase", e);
    }
}


export { app, db, auth };
