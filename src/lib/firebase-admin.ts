
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
    if (serviceAccountKey) {
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
        try {
            initializeApp({
                credential: admin.credential.applicationDefault(),
                projectId: 'ggr1-4fa1c',
            });
            console.log('✅ [Firebase Admin] SDK initialized successfully using Application Default Credentials.');
        } catch (error) {
            console.error('❌ [Firebase Admin] Error initializing with Application Default Credentials:', error);
            throw new Error('Could not initialize Firebase Admin SDK. Credentials not found.');
        }
    }
  }
  
  adminApp = getApp();
  adminAuthInstance = getAuth(adminApp);
  adminDbInstance = getFirestore(adminApp);
}

initializeFirebaseAdmin();

export const adminDb = () => adminDbInstance;
export const adminAuth = () => adminAuthInstance;
