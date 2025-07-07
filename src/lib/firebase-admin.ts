
import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import fs from 'fs';
import path from 'path';

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    if (!adminDb) adminDb = admin.firestore();
    if (!adminAuth) adminAuth = admin.auth();
    return;
  }

  const serviceAccountPath = path.resolve(process.cwd(), 'src/lib/serviceAccountKey.json');
  const logError = (reason: string, details?: string) => {
    console.error(
      '\n********************************************************************************\n' +
      '** Firebase Admin SDK initialization failed!                                  **\n' +
      '** ---------------------------------------------------------------------------- **\n' +
      `** Reason: ${reason}\n` +
      (details ? `** Details: ${details}\n` : '') +
      '********************************************************************************\n'
    );
  };

  try {
    if (!fs.existsSync(serviceAccountPath)) {
      logError(`The service account file was not found at the expected path: ${serviceAccountPath}. Please create this file.`);
      return;
    }

    const serviceAccountString = fs.readFileSync(serviceAccountPath, 'utf-8');
    if (!serviceAccountString.trim() || serviceAccountString.includes('please_paste_your_key_here')) {
        logError("The 'src/lib/serviceAccountKey.json' file is either empty or still contains the placeholder text. Please paste your full service account key from the Firebase console.");
        return;
    }

    let serviceAccount: admin.ServiceAccount;
    try {
        serviceAccount = JSON.parse(serviceAccountString);
    } catch (e: any) {
        logError("The 'src/lib/serviceAccountKey.json' file contains invalid JSON. Please ensure it is a valid JSON object.", `Parsing error: ${e.message}`);
        return;
    }
    
    if (!serviceAccount.project_id) {
        logError("The service account JSON is invalid or incomplete: missing 'project_id'. Please re-download the key from the Firebase console and paste the entire contents.");
        return;
    }
     if (!serviceAccount.private_key) {
        logError("The service account JSON is invalid or incomplete: missing 'private_key'. Please re-download the key from the Firebase console and paste the entire contents.");
        return;
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    
    console.log('Firebase Admin SDK initialized successfully.');
    adminDb = admin.firestore();
    adminAuth = admin.auth();

  } catch (error: any) {
    logError(error.message);
  }
}

initializeFirebaseAdmin();

export { adminDb, adminAuth };
