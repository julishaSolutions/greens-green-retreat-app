import * as admin from 'firebase-admin';

const serviceAccount: admin.ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
};

const isFirebaseAdminConfigValid =
  serviceAccount.projectId &&
  serviceAccount.clientEmail &&
  serviceAccount.privateKey;

if (!admin.apps.length && isFirebaseAdminConfigValid) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
  }
} else if (!isFirebaseAdminConfigValid) {
    console.warn("Firebase Admin configuration is incomplete. Server-side features will not have admin privileges. Please check your .env.local file.");
}


const adminDb = isFirebaseAdminConfigValid ? admin.firestore() : null;
const adminAuth = isFirebaseAdminConfigValid ? admin.auth() : null;

export { adminDb, adminAuth };
