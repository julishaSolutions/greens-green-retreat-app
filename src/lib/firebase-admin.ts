
import * as admin from 'firebase-admin';
import { getApps, initializeApp, type App, cert, getApp } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

let adminApp: App;
let adminAuthInstance: Auth;
let adminDbInstance: Firestore;

function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    console.log('[Firebase Admin] Initializing Firebase Admin SDK...');
    try {
      // When running in a Google Cloud environment (like App Hosting),
      // using `applicationDefault()` allows the SDK to automatically find the service account credentials.
      initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: 'ggr1-4fa1c',
      });
      console.log('✅ [Firebase Admin] SDK initialized successfully using Application Default Credentials.');
    } catch (error) {
      console.error('❌ [Firebase Admin] Error initializing Admin SDK:', error);
      throw new Error('Could not initialize Firebase Admin SDK. Service account credentials may be missing or invalid.');
    }
  }
  
  adminApp = getApp();
  adminAuthInstance = getAuth(adminApp);
  adminDbInstance = getFirestore(adminApp);
}

// Call the initialization function immediately so the instances are ready.
initializeFirebaseAdmin();

export const adminDb = () => adminDbInstance;
export const adminAuth = () => adminAuthInstance;
