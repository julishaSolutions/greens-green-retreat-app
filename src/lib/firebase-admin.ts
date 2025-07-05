import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

function initializeAdminApp() {
  if (getApps().length > 0) {
    return admin.app();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase Admin credentials (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) are not fully provided in .env.local. Please check your configuration and restart the server.'
    );
  }

  const serviceAccount: admin.ServiceAccount = {
    projectId,
    clientEmail,
    // The private key from the .env file might come with literal "\\n" characters
    // or as a multi-line string. We replace the literal "\\n" with actual newlines.
    privateKey: privateKey.replace(/\\n/g, '\n'),
  };

  try {
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
    return app;
  } catch (error: any) {
    throw new Error(
      `Failed to initialize Firebase Admin SDK. Please check your credentials in .env.local. Original error: ${error.message}`
    );
  }
}

const adminApp = initializeAdminApp();
const adminDb = adminApp ? admin.firestore() : null;
const adminAuth = adminApp ? admin.auth() : null;

export { adminDb, adminAuth };
