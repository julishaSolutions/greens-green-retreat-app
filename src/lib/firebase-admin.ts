
import * as admin from 'firebase-admin';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

// This is the definitive singleton pattern for initializing Firebase Admin in a Next.js environment.
// It ensures that the SDK is initialized only once and uses Application Default Credentials.

let adminApp: admin.app.App | null = null;
let adminAuthInstance: Auth | null = null;
let adminDbInstance: Firestore | null = null;

function initializeAdminApp(): admin.app.App {
  if (admin.apps.length > 0) {
    // Return the already initialized app.
    // This happens in development with hot-reloading.
    return admin.apps[0]!;
  }
  
  try {
    // When no credentials are provided, the SDK automatically uses Application Default Credentials.
    // However, explicitly setting the projectId from environment variables is more robust.
    const app = admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
    return app;
  } catch (e) {
    console.error('CRITICAL: Failed to initialize Firebase Admin SDK. Check server logs for details.', e);
    // This is a critical failure, the application cannot proceed.
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
