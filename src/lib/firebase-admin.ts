
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

    let credential;
    if (serviceAccountKey) {
        try {
            const serviceAccount = JSON.parse(serviceAccountKey);
            credential = admin.credential.cert(serviceAccount);
            console.log('[Firebase Admin] Using Service Account Key for authentication.');
        } catch (error) {
            console.error('❌ [Firebase Admin] Error parsing SERVICE_ACCOUNT_KEY:', error);
            throw new Error('The SERVICE_ACCOUNT_KEY environment variable is not a valid JSON string.');
        }
    } else {
        console.log('[Firebase Admin] Service Account Key not found. Using Application Default Credentials.');
        credential = admin.credential.applicationDefault();
    }
    
    try {
        initializeApp({
            credential,
            projectId: 'ggr1-4fa1c',
        });
        console.log('✅ [Firebase Admin] SDK initialized successfully.');
    } catch(error) {
        console.error('❌ [Firebase Admin] Could not initialize Firebase Admin SDK:', error);
        throw new Error('Failed to initialize Firebase Admin SDK with the provided credentials.');
    }
  }
  
  adminApp = getApp();
  adminAuthInstance = getAuth(adminApp);
  adminDbInstance = getFirestore(adminApp);
}

try {
  initializeFirebaseAdmin();
} catch (error) {
    console.error('CRITICAL: Firebase Admin initialization failed and could not recover.', error);
}

export const adminDb = () => adminDbInstance;
export const adminAuth = () => adminAuthInstance;
