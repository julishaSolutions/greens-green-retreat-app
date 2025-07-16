
import * as admin from 'firebase-admin';
import { getApps, initializeApp, type App, getApp } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

let adminApp: App;
let adminAuthInstance: Auth;
let adminDbInstance: Firestore;

function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    adminApp = getApp();
  } else {
    const serviceAccountKey = process.env.SERVICE_ACCOUNT_KEY;

    if (serviceAccountKey) {
      // For local development with a service account key
      adminApp = initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccountKey)),
      });
    } else {
      // For production environments (like Firebase App Hosting)
      adminApp = initializeApp();
    }
  }

  adminAuthInstance = getAuth(adminApp);
  adminDbInstance = getFirestore(adminApp);
}

// Initialize immediately
try {
  initializeFirebaseAdmin();
} catch (error) {
  console.error('CRITICAL: Firebase Admin initialization failed.', error);
  throw error;
}

export const adminDb = () => adminDbInstance;
export const adminAuth = () => adminAuthInstance;
