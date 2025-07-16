
import * as admin from 'firebase-admin';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { serviceAccount } from './service-account';

// This is the definitive singleton pattern for initializing Firebase Admin in a Next.js environment.
// It ensures that the SDK is initialized only once.

let adminApp: admin.app.App | null = null;
let adminAuthInstance: Auth | null = null;
let adminDbInstance: Firestore | null = null;

function initializeAdminApp(): admin.app.App {
  if (admin.apps.length > 0) {
    // If an app is already initialized, return it.
    // This happens in development with hot-reloading.
    return admin.apps[0]!;
  }
  
  try {
    // Directly use the imported service account object.
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
    return app;
  } catch (e) {
    console.error('CRITICAL: Failed to initialize Firebase Admin SDK. Check your service-account.ts file.', e);
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
