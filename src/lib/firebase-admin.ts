
import * as admin from 'firebase-admin';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { credential } from 'firebase-admin';
import serviceAccount from '@/lib/service-account.json';

// This is the definitive singleton pattern for initializing Firebase Admin in a Next.js environment.
// It ensures that the SDK is initialized only once.

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
    // Check if the service account key has been populated.
    // The 'type' property is a required field in service account JSON files.
    if (serviceAccount.type) {
      console.log('[FirebaseAdmin] Initializing with service account credentials...');
      const app = admin.initializeApp({
        credential: credential.cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
      return app;
    }
  } catch (e) {
    // This catch block handles cases where service-account.json might be malformed
    // or when there's an issue with initialization. We fall back to ADC.
    console.warn('[FirebaseAdmin] Service account JSON appears invalid, falling back to Application Default Credentials.', e);
  }

  // Fallback to Application Default Credentials (ADC) if service account is not available.
  // This is the default behavior for deployed Firebase/Google Cloud environments.
  console.log('[FirebaseAdmin] Initializing with Application Default Credentials...');
  try {
    const app = admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
    return app;
  } catch (e) {
    console.error('CRITICAL: Failed to initialize Firebase Admin SDK. Check server logs for details.', e);
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
