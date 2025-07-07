import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
// The serviceAccountKey.json file is not committed to version control for security.
// It should be created in the `src/lib` directory.
import serviceAccount from './serviceAccountKey.json';

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

if (getApps().length === 0) {
  try {
    // A simple check to see if the default placeholder is still there.
    if ((serviceAccount as any).project_id === 'please_paste_your_key_here') {
      throw new Error(
        "The service account key in 'src/lib/serviceAccountKey.json' is still the default placeholder. Please paste your actual credentials from the Firebase console."
      );
    }
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
    adminDb = admin.firestore();
    adminAuth = admin.auth();
  } catch (error: any) {
    // Provide a clear, actionable error message in the console.
    console.error(
      '\n********************************************************************************\n' +
      '** Firebase Admin SDK initialization failed!                                  **\n' +
      '** This is likely due to an issue with `src/lib/serviceAccountKey.json`.      **\n' +
      '** ---------------------------------------------------------------------------- **\n' +
      `** Please check that the file exists and contains the complete, valid JSON    **\n` +
      '** you downloaded from the Firebase console.                                  **\n' +
      '** ---------------------------------------------------------------------------- **\n' +
      `** Original Error: ${error.message}\n` +
      '********************************************************************************\n'
    );
  }
} else {
  // If the app is already initialized, just get the instances.
  if (!adminDb) adminDb = admin.firestore();
  if (!adminAuth) adminAuth = admin.auth();
}

export { adminDb, adminAuth };
