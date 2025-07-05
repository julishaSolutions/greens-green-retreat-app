import * as admin from 'firebase-admin';

// Define the service account object using environment variables.
// Next.js automatically loads variables from .env.local.
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // The private key from the .env file needs its newlines restored.
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Check if all credential components are available.
const areCredentialsAvailable = 
  serviceAccount.projectId && 
  serviceAccount.clientEmail && 
  serviceAccount.privateKey;

// Initialize the app only if it hasn't been initialized yet AND credentials are provided.
if (!admin.apps.length) {
  if (areCredentialsAvailable) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized successfully.');
    } catch (error: any) {
      // This will catch any errors during initialization, such as a malformed private key.
      throw new Error(`Failed to initialize Firebase Admin SDK. Please check your credentials in .env.local. Original error: ${error.message}`);
    }
  } else {
    // This case will be hit if any of the environment variables are missing.
    console.warn("Firebase Admin credentials are not fully provided in .env.local. Firebase Admin features will be disabled.");
  }
}

// Conditionally export the services. If initialization failed or was skipped, these will be null.
const adminDb = admin.apps.length ? admin.firestore() : null;
const adminAuth = admin.apps.length ? admin.auth() : null;

export { adminDb, adminAuth };
