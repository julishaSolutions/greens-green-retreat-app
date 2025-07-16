
import * as admin from 'firebase-admin';
import { getApps, initializeApp, type App, getApp } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

let adminApp: App;
let adminAuthInstance: Auth;
let adminDbInstance: Firestore;

// This is the single, robust initialization function.
function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    adminApp = getApp();
  } else {
    console.log('[Firebase Admin] Initializing Firebase Admin SDK...');
    const serviceAccountKey = process.env.SERVICE_ACCOUNT_KEY;

    const config = {
      // Explicitly providing the public project config ensures the SDK has the correct context.
      authDomain: "ggr1-4fa1c.firebaseapp.com",
      projectId: "ggr1-4fa1c",
      storageBucket: "ggr1-4fa1c.appspot.com",
      credential: serviceAccountKey 
        ? admin.credential.cert(JSON.parse(serviceAccountKey)) 
        : admin.credential.applicationDefault(),
    };

    adminApp = initializeApp(config);
    console.log('[Firebase Admin] Initialization complete.');
  }

  adminAuthInstance = getAuth(adminApp);
  adminDbInstance = getFirestore(adminApp);
}

// Call the initialization function immediately when the module is loaded.
try {
  initializeFirebaseAdmin();
} catch (error) {
  console.error('CRITICAL: Firebase Admin initialization failed.', error);
  // Re-throw the error to ensure server startup fails if Firebase Admin can't initialize.
  throw error;
}

export const adminDb = () => adminDbInstance;
export const adminAuth = () => adminAuthInstance;
