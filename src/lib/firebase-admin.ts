
import * as admin from 'firebase-admin';
import { getApps, initializeApp, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

// This is a global cache for the initialized services to ensure it only runs once.
let adminServices: { db: Firestore; auth: Auth } | null = null;

function getFirebaseAdmin() {
  // If we've already initialized, just return the cached services.
  if (adminServices) {
    return adminServices;
  }

  // If there are no apps, we need to initialize one.
  if (getApps().length === 0) {
    // Check if running in a Google Cloud environment (like App Hosting or Cloud Run).
    // GOOGLE_CLOUD_PROJECT is a standard environment variable in these environments.
    if (process.env.GOOGLE_CLOUD_PROJECT) {
        console.log('[Firebase Admin] Google Cloud environment detected. Initializing with Application Default Credentials.');
        initializeApp();
    } else {
        console.log('[Firebase Admin] Local environment detected. Attempting to initialize with credentials from .env file.');
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if (projectId && clientEmail && privateKey) {
             initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            });
            console.log('✅ [Firebase Admin] SDK initialized successfully from .env file!');
        } else {
            // This will cause a hard crash during local development if .env is missing,
            // which is good because it surfaces the configuration error immediately.
            throw new Error("[Firebase Admin] CRITICAL: Service account credentials missing from .env file. Cannot initialize for local development.");
        }
    }
  }

  // Get the default app and its services, then cache them.
  const db = getFirestore();
  const auth = getAuth();
  
  adminServices = { db, auth };
  return adminServices;
}

// These are the exported functions that our services will use.
// They ensure that getFirebaseAdmin() is called and initialization is complete.
export const adminDb = () => getFirebaseAdmin().db;
export const adminAuth = () => getFirebaseAdmin().auth;
