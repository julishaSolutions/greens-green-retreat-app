
import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

// This is the new, more robust way to get credentials
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// The private key needs to be formatted correctly.
// Environment variables often escape newline characters, so we must replace them back.
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// We will only attempt to initialize if the environment variables are all present.
if (projectId && clientEmail && privateKey) {
  if (getApps().length === 0) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('✅ Firebase Admin SDK initialized successfully from environment variables!');
      adminDb = admin.firestore();
      adminAuth = admin.auth();
    } catch (error: any) {
      console.error('❌ [CRITICAL ERROR] Firebase Admin SDK initialization failed even with environment variables.');
      console.error('   This likely means the values in your .env.local file are incorrect or the service account has a permissions issue.');
      console.error(`   Original Error: ${error.message}`);
    }
  } else {
    // If the app is already initialized, just get the instances.
    adminDb = admin.firestore();
    adminAuth = admin.auth();
  }
} else {
    console.warn('⚠️ Firebase Admin environment variables are missing. Server-side Firebase features will be disabled.');
}

export { adminDb, adminAuth };
