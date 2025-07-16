
import * as admin from 'firebase-admin';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

// This is the definitive singleton pattern for initializing Firebase Admin in a Next.js environment.
// It ensures that the SDK is initialized only once and is resilient to build-time environment variable issues.

let adminApp: admin.app.App | null = null;
let adminAuthInstance: Auth | null = null;
let adminDbInstance: Firestore | null = null;

function initializeAdminApp() {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  const serviceAccountKey = process.env.SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    throw new Error('CRITICAL: SERVICE_ACCOUNT_KEY environment variable is not set. The application cannot start.');
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
    return app;
  } catch (e) {
    console.error('Failed to parse SERVICE_ACCOUNT_KEY or initialize Firebase Admin SDK:', e);
    throw new Error('Failed to initialize Firebase Admin SDK due to invalid credentials.');
  }
}

function getAdminApp() {
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
