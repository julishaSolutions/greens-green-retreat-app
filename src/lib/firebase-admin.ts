
import * as admin from 'firebase-admin';
import { getApps, initializeApp, type App, cert, getApp } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

let adminApp: App;
let adminAuthInstance: Auth;
let adminDbInstance: Firestore;

// This is the single, robust initialization function
function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    adminApp = getApp();
  } else {
    console.log('[Firebase Admin] Initializing Firebase Admin SDK...');
    const serviceAccountKey = process.env.SERVICE_ACCOUNT_KEY;

    if (serviceAccountKey) {
      // For local development using a service account key
      try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        adminApp = initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: 'ggr1-4fa1c',
        });
        console.log('[Firebase Admin] Initialized with Service Account Key.');
      } catch (error) {
        console.error('❌ [Firebase Admin] Error parsing SERVICE_ACCOUNT_KEY:', error);
        throw new Error('The SERVICE_ACCOUNT_KEY environment variable is not a valid JSON string.');
      }
    } else {
      // For production environment (e.g., Firebase App Hosting)
      console.log('[Firebase Admin] Initializing with Application Default Credentials.');
      adminApp = initializeApp({
          projectId: 'ggr1-4fa1c',
      });
    }
  }

  adminAuthInstance = getAuth(adminApp);
  adminDbInstance = getFirestore(adminApp);
}

// Call the initialization function
try {
  initializeFirebaseAdmin();
} catch (error) {
  console.error('CRITICAL: Firebase Admin initialization failed.', error);
}

export const adminDb = () => adminDbInstance;
export const adminAuth = () => adminAuthInstance;
