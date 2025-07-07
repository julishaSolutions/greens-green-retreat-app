
import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import serviceAccount from './serviceAccountKey.json';

// A function to check if the service account object has the required fields.
function isServiceAccount(obj: any): obj is admin.ServiceAccount {
    return obj && typeof obj.project_id === 'string' && typeof obj.private_key === 'string' && typeof obj.client_email === 'string';
}

function initializeAdminApp() {
  if (getApps().length > 0) {
    return admin.app();
  }

  // Perform detailed checks on the serviceAccount object.
  if (!isServiceAccount(serviceAccount)) {
    let errorMessage = 'Firebase Admin SDK initialization failed. The "src/lib/serviceAccountKey.json" file is not a valid service account key. Please ensure you have pasted the entire contents of your downloaded key file.\n';
    
    if (!serviceAccount || typeof serviceAccount !== 'object') {
        errorMessage += 'Reason: The file appears to be empty or malformed.\n';
    } else {
        if (serviceAccount.type === 'please_paste_your_key_here') {
            errorMessage += 'Reason: The default placeholder content is still present.\n';
        } else {
            if (!serviceAccount.project_id) errorMessage += 'Reason: Missing "project_id".\n';
            if (!serviceAccount.private_key) errorMessage += 'Reason: Missing "private_key".\n';
            if (!serviceAccount.client_email) errorMessage += 'Reason: Missing "client_email".\n';
        }
    }

    console.error(
      '************************************************************************************************\n' +
      errorMessage +
      '************************************************************************************************'
    );
    return null;
  }

  try {
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
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
