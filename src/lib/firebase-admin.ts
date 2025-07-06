
import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

function initializeAdminApp() {
  // This function ensures we only initialize the app once.
  if (getApps().length > 0) {
    return admin.app();
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountJson) {
    console.warn(
      'Firebase Admin SDK is not initialized. The FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set. Please check your .env.local file and RESTART the development server. Server-side Firebase features will be disabled.'
    );
    return null;
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
    return app;
  } catch (error: any) {
    console.error(
      `Failed to initialize Firebase Admin SDK due to a parsing error. Please check the FIREBASE_SERVICE_ACCOUNT_JSON in your .env.local file. It seems to be malformed. Original error: ${error.message}. Server-side Firebase features will be disabled.`
    );
    return null;
  }
}

const adminApp = initializeAdminApp();
const adminDb = adminApp ? admin.firestore() : null;
const adminAuth = adminApp ? admin.auth() : null;

export { adminDb, adminAuth };
