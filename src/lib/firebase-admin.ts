
import * as admin from 'firebase-admin';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

let adminServices: { db: Firestore; auth: Auth } | null = null;

function getFirebaseAdmin() {
  if (adminServices) {
    return adminServices;
  }

  if (getApps().length === 0) {
    console.log('[Firebase Admin] Initializing Firebase Admin SDK...');
    // When deployed on Google Cloud (like App Hosting), the SDK automatically
    // finds the project credentials. For local development, it relies on the
    // GOOGLE_APPLICATION_CREDENTIALS env var or a service account file.
    // Explicitly setting the project ID is a good practice for clarity.
    initializeApp({
      projectId: 'ggr1-4fa1c',
    });
     console.log('✅ [Firebase Admin] SDK initialized successfully.');
  }

  const db = getFirestore();
  const auth = getAuth();
  
  adminServices = { db, auth };
  return adminServices;
}

export const adminDb = () => getFirebaseAdmin().db;
export const adminAuth = () => getFirebaseAdmin().auth;
