
import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
// The 'serviceAccountKey.json' file is gitignored. You must create it manually.
// It is imported here and used to initialize the Firebase Admin SDK.
import serviceAccount from './serviceAccountKey.json';

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

// --- Robust Initialization Logic ---
try {
  // 1. Check for the default placeholder key.
  if ((serviceAccount as any).type === 'please_paste_your_key_here') {
    throw new Error('The service account key in `src/lib/serviceAccountKey.json` is still the default placeholder. Please paste your actual credentials.');
  }

  // 2. Perform a basic structural check on the key.
  if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
    throw new Error('The service account key in `src/lib/serviceAccountKey.json` appears to be malformed or incomplete. It is missing required fields like `project_id`, `private_key`, or `client_email`.');
  }

  // 3. Initialize the app if it hasn't been already.
  if (!getApps().length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as any),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  }

  // 4. Assign the db and auth instances.
  adminDb = admin.firestore();
  adminAuth = admin.auth();

} catch (error: any) {
  // Catch any errors during the process and log a clear message.
  console.error('********************************************************************************');
  console.error('** Firebase Admin SDK initialization failed!                                  **');
  console.error('** -----------------------------------------                                  **');
  console.error(`** Reason: ${error.message}`);
  console.error('********************************************************************************');
}

export { adminDb, adminAuth };
