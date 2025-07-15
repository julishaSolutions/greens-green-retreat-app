
import * as admin from 'firebase-admin';
import { getApps, initializeApp, type App } from 'firebase-admin/app';
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
      // the SDK automatically finds the service account credentials.
      initializeApp({
        projectId: 'ggr1-4fa1c', // Explicitly setting the project ID
      });
      console.log('✅ [Firebase Admin] SDK initialized successfully in Cloud environment.');
    } catch (error) {
      console.error('❌ [Firebase Admin] Error initializing Admin SDK:', error);
      // This path is more likely to be hit in local development if credentials aren't set.
      // In a deployed environment, this would signify a major configuration issue.
      throw new Error('Could not initialize Firebase Admin SDK. Service account credentials may be missing or invalid.');
    }
  }
  
  adminApp = getApps()[0];
  adminAuthInstance = getAuth(adminApp);
  adminDbInstance = getFirestore(adminApp);
}

// Call the initialization function immediately so the instances are ready.
initializeFirebaseAdmin();

export const adminDb = () => adminDbInstance;
export const adminAuth = () => adminAuthInstance;

