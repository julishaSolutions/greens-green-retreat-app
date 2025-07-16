
import * as admin from 'firebase-admin';
import { getApps, initializeApp, type App, cert, getApp } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

let adminApp: App;
let adminAuthInstance: Auth;
let adminDbInstance: Firestore;

const serviceAccountKey = process.env.SERVICE_ACCOUNT_KEY;

function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    console.log('[Firebase Admin] Initializing Firebase Admin SDK...');
    
    // Check if running in a Google Cloud environment (like App Hosting or Cloud Run)
    if (process.env.GCP_PROJECT) {
        console.log('[Firebase Admin] Google Cloud environment detected. Using Application Default Credentials.');
        try {
            initializeApp({
                projectId: 'ggr1-4fa1c',
            });
            console.log('✅ [Firebase Admin] SDK initialized successfully using Application Default Credentials.');
        } catch (error) {
            console.error('❌ [Firebase Admin] Error initializing with Application Default Credentials:', error);
            throw new Error('Could not initialize Firebase Admin SDK in GCP environment.');
        }
    } else if (serviceAccountKey) {
        console.log('[Firebase Admin] Service Account Key found. Initializing for local development.');
        try {
            const credentials = JSON.parse(serviceAccountKey);
            initializeApp({
                credential: cert(credentials),
                projectId: 'ggr1-4fa1c',
            });
            console.log('✅ [Firebase Admin] SDK initialized successfully using Service Account Key.');
        } catch(error) {
            console.error('❌ [Firebase Admin] Error initializing with Service Account Key:', error);
            throw new Error('Could not initialize Firebase Admin SDK. The Service Account Key may be invalid.');
        }
    } else {
        console.warn('[Firebase Admin] No credentials found. For local development, set the SERVICE_ACCOUNT_KEY environment variable. For deployed environments, ensure the GCP_PROJECT variable is set.');
        throw new Error('Could not initialize Firebase Admin SDK. Credentials not found.');
    }
  }
  
  adminApp = getApp();
  adminAuthInstance = getAuth(adminApp);
  adminDbInstance = getFirestore(adminApp);
}

initializeFirebaseAdmin();

export const adminDb = () => adminDbInstance;
export const adminAuth = () => adminAuthInstance;
