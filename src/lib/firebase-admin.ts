
import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

// The credentials will now be sourced from environment variables
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// The private key needs to be formatted correctly.
// Environment variables might escape the newlines, so we replace \\n with \n.
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

try {
  // Check if all required environment variables are present
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing required Firebase Admin credentials in environment variables. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your .env.local file.');
  }
  
  // Initialize the app only if it hasn't been initialized yet
  if (getApps().length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log('*******************************************************************');
    console.log('**   Firebase Admin SDK initialized successfully from env vars!  **');
    console.log('*******************************************************************');
  }
  
  adminDb = admin.firestore();
  adminAuth = admin.auth();

} catch (error: any) {
    console.error('\n********************************************************************************');
    console.error('** [CRITICAL ERROR] Firebase Admin SDK initialization failed.                   **');
    if (error.message.includes('Missing required Firebase Admin credentials')) {
        console.error(`** Details: ${error.message}`);
    } else {
        console.error('** There is an issue with the Firebase Admin credentials provided in your   **');
        console.error('** environment variables. Please double-check them.                       **');
        console.error(`** Original Error: ${error.message}`);
    }
    console.error('********************************************************************************\n');
}

export { adminDb, adminAuth };
