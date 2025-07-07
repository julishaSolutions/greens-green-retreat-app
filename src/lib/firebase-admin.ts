
import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
// The 'serviceAccountKey.json' file is gitignored. You must create it manually.
// It is imported here and used to initialize the Firebase Admin SDK.
import serviceAccount from './serviceAccountKey.json';

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

// A function to check if the service account object has the required fields.
function isServiceAccount(obj: any): obj is admin.ServiceAccount {
    return obj && typeof obj.project_id === 'string' && typeof obj.private_key === 'string' && typeof obj.client_email === 'string';
}

// Check if the service account key is the default placeholder or invalid.
if (!isServiceAccount(serviceAccount) || serviceAccount.type === 'please_paste_your_key_here') {
  console.error(
    '************************************************************************************************\n' +
    '** Firebase Admin SDK Not Configured!                                                         **\n' +
    '** ------------------------------------                                                         **\n' +
    '** Please create or check `src/lib/serviceAccountKey.json` and paste your complete Firebase   **\n' +
    '** service account credentials into it. It appears to be missing, empty, or incomplete.       **\n' +
    '** You can download your service account key from your Firebase project settings.             **\n' +
    '************************************************************************************************'
  );
} else {
  // Initialize the Firebase Admin SDK.
  try {
    if (!getApps().length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized successfully.');
    }
    adminDb = admin.firestore();
    adminAuth = admin.auth();
  } catch (error: any) {
    // This will catch any errors during initialization, including malformed JSON.
    console.error('Firebase Admin SDK initialization failed:', error.message);
    console.error('Please ensure that `src/lib/serviceAccountKey.json` contains a valid, unmodified service account key.');
  }
}

export { adminDb, adminAuth };
