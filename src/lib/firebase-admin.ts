
import * as admin from 'firebase-admin';
import { getApps, initializeApp, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminServices: { db: Firestore; auth: Auth } | null = null;

// Explicitly define the project ID
const FIREBASE_PROJECT_ID = 'ggr1-4fa1c';

function getFirebaseAdmin() {
  if (adminServices) {
    return adminServices;
  }

  if (getApps().length === 0) {
    // Deployed environment (Google Cloud, e.g., App Hosting)
    if (process.env.GOOGLE_CLOUD_PROJECT) {
        console.log(`[Firebase Admin] Google Cloud environment detected. Initializing with Application Default Credentials for project ${FIREBASE_PROJECT_ID}.`);
        initializeApp({ projectId: FIREBASE_PROJECT_ID });
    } 
    // Local development environment
    else {
        console.log(`[Firebase Admin] Local environment detected. Attempting to initialize with credentials from .env file for project ${FIREBASE_PROJECT_ID}.`);
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if (FIREBASE_PROJECT_ID && clientEmail && privateKey) {
             initializeApp({
                credential: admin.credential.cert({
                    projectId: FIREBASE_PROJECT_ID,
                    clientEmail,
                    privateKey,
                }),
                projectId: FIREBASE_PROJECT_ID,
            });
            console.log('✅ [Firebase Admin] SDK initialized successfully from .env file!');
        } else {
            throw new Error("[Firebase Admin] CRITICAL: Service account credentials (FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) missing from .env file. Cannot initialize for local development.");
        }
    }
  }

  const db = getFirestore();
  const auth = getAuth();
  
  adminServices = { db, auth };
  return adminServices;
}

export const adminDb = () => getFirebaseAdmin().db;
export const adminAuth = () => getFirebaseAdmin().auth;
