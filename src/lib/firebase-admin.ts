
import * as admin from 'firebase-admin';
import { getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let adminApp: App;
let adminAuthInstance: Auth;
let adminDbInstance: Firestore;

if (!getApps().length) {
  const serviceAccountKey = process.env.SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
    // For local development with a service account key file
    adminApp = initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccountKey)),
    });
  } else {
    // For production environments (like Firebase App Hosting) where credentials are automatically provided
    adminApp = initializeApp();
  }
} else {
  adminApp = getApps()[0];
}

adminAuthInstance = getAuth(adminApp);
adminDbInstance = getFirestore(adminApp);

export const adminDb = () => adminDbInstance;
export const adminAuth = () => adminAuthInstance;
