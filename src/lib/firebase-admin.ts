
import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
// The 'serviceAccountKey.json' file is gitignored. You must create it manually.
// It is imported here and used to initialize the Firebase Admin SDK.
import serviceAccount from './serviceAccountKey.json';

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

// Check if the service account key is the default placeholder.
if ((serviceAccount as any).type === 'please_paste_your_key_here') {
  console.error(
    '************************************************************************************************\n' +
    '** Firebase Admin SDK Not Configured!                                                         **\n' +
    '** ------------------------------------                                                         **\n' +
    '** Please create or check `src/lib/serviceAccountKey.json` and paste your complete Firebase   **\n' +
    '** service account credentials into it. It is currently using the default placeholder.        **\n' +
    '** You can download your service account key from your Firebase project settings.             **\n' +
    '************************************************************************************************'
  );
} else {
  // Initialize the Firebase Admin SDK.
  try {
    if (!getApps().length) {
      admin.initializeApp({
        // Cast to any to satisfy the type-checker, as the imported JSON might not perfectly match the SDK's type definition at compile time.
        // The SDK will perform its own validation at runtime.
        credential: admin.credential.cert(serviceAccount as any),
      });
      console.log('Firebase Admin SDK initialized successfully.');
    }
    adminDb = admin.firestore();
    adminAuth = admin.auth();
  } catch (error: any) {
    console.error('********************************************************************************');
    console.error('** Firebase Admin SDK initialization failed!                                  **');
    console.error('** -----------------------------------------                                  **');
    console.error('** This usually means the content of `src/lib/serviceAccountKey.json`         **');
    console.error('** is not a valid JSON key file. Please re-download it from Firebase          **');
    console.error('** and paste the entire, unmodified content into the file.                    **');
    console.error('** Original error:', error.message);
    console.error('********************************************************************************');
  }
}

export { adminDb, adminAuth };
