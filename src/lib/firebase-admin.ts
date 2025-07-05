import 'dotenv/config';
import * as admin from 'firebase-admin';

const serviceAccount: admin.ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
};

// Check if the essential variables are present.
if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
  // This log is helpful for debugging but won't stop the app in production.
  // The throw below is the critical part.
  console.error('Firebase Admin configuration is missing or incomplete in .env.local. Please check your environment variables.');
}

// Only initialize if no apps are present to avoid re-initialization errors.
if (!admin.apps.length) {
  try {
    // Attempt to initialize the app.
    // This will throw a detailed error if the credentials are malformed.
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    // If initialization fails, throw a new, more descriptive error.
    // This will stop the server and show a clear error page during development.
    throw new Error(`Failed to initialize Firebase Admin SDK. Please check the credentials in your .env.local file. Original error: ${error.message}`);
  }
}

// If we've reached this point, initialization was successful.
const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { adminDb, adminAuth };
