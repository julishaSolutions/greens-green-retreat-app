
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
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      adminApp = initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (e) {
      console.error('Error parsing service account key or initializing Firebase Admin SDK:', e);
      // Fallback to default initialization if parsing fails
      adminApp = initializeApp();
    }
  } else {
    console.log("SERVICE_ACCOUNT_KEY not found. Initializing with Application Default Credentials.");
    adminApp = initializeApp();
  }
} else {
  adminApp = getApps()[0];
}

adminAuthInstance = getAuth(adminApp);
adminDbInstance = getFirestore(adminApp);

export const adminDb = () => adminDbInstance;
export const adminAuth = () => adminAuthInstance;
