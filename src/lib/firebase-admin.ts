
import * as admin from 'firebase-admin';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { credential } from 'firebase-admin';

// This is the definitive singleton pattern for initializing Firebase Admin in a Next.js environment.
// It ensures that the SDK is initialized only once.

let adminApp: admin.app.App | null = null;
let adminAuthInstance: Auth | null = null;
let adminDbInstance: Firestore | null = null;

// Dynamically import the service account key.
// This allows the app to function without the key file (e.g., in deployed environments).
let serviceAccount: any = null;
try {
  // The 'any' type is used here to avoid TypeScript errors if the file doesn't exist.
  serviceAccount = require('@/lib/service-account.json');
} catch (e) {
  // It's safe to ignore this error. It just means the service account file isn't present.
  // The console log is now more informative for debugging.
  // console.debug('[FirebaseAdmin] Service account key not found. Using Application Default Credentials. This is normal for deployed environments.');
}

function initializeAdminApp(): admin.app.App {
  if (admin.apps.length > 0) {
    // Return the already initialized app.
    // This happens in development with hot-reloading.
    return admin.apps[0]!;
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  // Check if a valid service account object was loaded.
  // The 'type' property is a required field in service account JSON files.
  if (serviceAccount && serviceAccount.type) {
    console.info('[FirebaseAdmin] Initializing with service account credentials...');
    try {
      return admin.initializeApp({
        credential: credential.cert(serviceAccount),
        // Explicitly use the project ID from environment variables to ensure we connect to the correct project.
        projectId: projectId,
      });
    } catch (e: any) {
       console.warn(`[FirebaseAdmin] Service account JSON appears invalid (Code: ${e.code}), falling back to Application Default Credentials.`, e.message);
    }
  }

  // Fallback to Application Default Credentials (ADC) if service account is not available or invalid.
  // This is the default behavior for deployed Firebase/Google Cloud environments.
  console.info('[FirebaseAdmin] Initializing with Application Default Credentials...');
  try {
    const app = admin.initializeApp({
      projectId: projectId,
    });
    return app;
  } catch (e: any) {
    console.error(`CRITICAL: Failed to initialize Firebase Admin SDK (Code: ${e.code}). Check server logs for details.`, e.message);
    // Throwing an error here can prevent the app from starting, which is often desired if Firebase is essential.
    throw new Error('Firebase Admin SDK initialization failed.');
  }
}

function getAdminApp(): admin.app.App {
  if (!adminApp) {
    adminApp = initializeAdminApp();
  }
  return adminApp;
}

export const adminDb = (): Firestore => {
  if (!adminDbInstance) {
    adminDbInstance = getFirestore(getAdminApp());
  }
  return adminDbInstance;
};

export const adminAuth = (): Auth => {
  if (!adminAuthInstance) {
    adminAuthInstance = getAuth(getAdminApp());
  }
  return adminAuthInstance;
};

    