
import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import serviceAccount from './serviceAccountKey.json';

function initializeAdminApp() {
  if (getApps().length > 0) {
    return admin.app();
  }

  // Check if the placeholder service account key is still present.
  if (serviceAccount.type === 'please_paste_your_key_here') {
    console.error(
      '************************************************************************************************\n' +
        '** Firebase Admin SDK is not initialized.                                                     **\n' +
        "** ACTION REQUIRED: Open the file 'src/lib/serviceAccountKey.json'                            **\n" +
        "** and replace its contents with your downloaded Firebase service account credentials.      **\n" +
        '** DO NOT PASTE YOUR KEY INTO THIS FILE (firebase-admin.ts).                                  **\n' +
        '** You must RESTART the server after updating the JSON file.                                  **\n' +
        '************************************************************************************************'
    );
    return null;
  }

  try {
    const app = admin.initializeApp({
      // The type assertion is necessary because we are importing a JSON file.
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully from serviceAccountKey.json.');
    return app;
  } catch (error: any) {
    console.error(
      `Failed to initialize Firebase Admin SDK. Please check the contents of 'src/lib/serviceAccountKey.json'. Original error: ${error.message}`
    );
    return null;
  }
}

const adminApp = initializeAdminApp();
const adminDb = adminApp ? admin.firestore() : null;
const adminAuth = adminApp ? admin.auth() : null;

export { adminDb, adminAuth };
