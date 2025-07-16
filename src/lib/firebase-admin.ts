
import * as admin from 'firebase-admin';
import { getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let adminApp: App;
let adminAuthInstance: Auth;
let adminDbInstance: Firestore;

// This check prevents re-initialization in hot-reload scenarios
if (!getApps().length) {
  const serviceAccountKey = process.env.SERVICE_ACCOUNT_KEY;

  if (serviceAccountKey) {
    try {
      // The most reliable way: parse the key and explicitly provide credentials and projectId
      const serviceAccount = JSON.parse(serviceAccountKey);
      adminApp = initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id, // Explicitly set the project ID
      });
    } catch (e) {
      console.error('Error parsing service account key or initializing Firebase Admin SDK:', e);
      // Fallback for environments where ADC might be available but key is malformed
      adminApp = initializeApp();
    }
  } else {
    // For production environments (like Firebase App Hosting)
    // where credentials are automatically provided via Application Default Credentials (ADC).
    console.log("SERVICE_ACCOUNT_KEY not found. Initializing with Application Default Credentials.");
    adminApp = initializeApp();
  }
} else {
  // Use the existing app if already initialized
  adminApp = getApps()[0];
}

adminAuthInstance = getAuth(adminApp);
adminDbInstance = getFirestore(adminApp);

export const adminDb = () => adminDbInstance;
export const adminAuth = () => adminAuthInstance;
