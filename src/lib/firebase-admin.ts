
import * as admin from 'firebase-admin';
import { getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let adminApp: App;
let adminAuthInstance: Auth;
let adminDbInstance: Firestore;

const serviceAccountKey = process.env.SERVICE_ACCOUNT_KEY;

if (!getApps().length) {
  if (!serviceAccountKey) {
    // This is a critical error. The app cannot function without credentials.
    // Throwing an error here provides a clear, immediate signal of what's wrong.
    throw new Error('CRITICAL: SERVICE_ACCOUNT_KEY environment variable is not set. The application cannot start.');
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    adminApp = initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // Explicitly providing the projectId from the service account key
      // is more robust than relying on auto-detection.
      projectId: serviceAccount.project_id,
    });
  } catch (e) {
    console.error('Failed to parse SERVICE_ACCOUNT_KEY or initialize Firebase Admin SDK:', e);
    // If parsing fails, we cannot continue.
    throw new Error('Failed to initialize Firebase Admin SDK due to invalid credentials.');
  }
} else {
  adminApp = getApps()[0];
}

adminAuthInstance = getAuth(adminApp);
adminDbInstance = getFirestore(adminApp);

export const adminDb = () => adminDbInstance;
export const adminAuth = () => adminAuthInstance;
