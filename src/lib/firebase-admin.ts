
import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import fs from 'fs';
import path from 'path';

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

function initializeFirebaseAdmin() {
  // Only run initialization once.
  if (getApps().length > 0) {
    if (!adminDb) adminDb = admin.firestore();
    if (!adminAuth) adminAuth = admin.auth();
    return;
  }

  const serviceAccountPath = path.resolve(process.cwd(), 'src/lib/serviceAccountKey.json');

  try {
    // Check if the file exists
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(`The service account file was not found at the expected path: ${serviceAccountPath}. Please ensure the file exists.`);
    }

    const serviceAccountString = fs.readFileSync(serviceAccountPath, 'utf-8');
    
    // Check if the file is empty or just has the placeholder
    if (!serviceAccountString || serviceAccountString.includes('please_paste_your_key_here')) {
        throw new Error("The 'src/lib/serviceAccountKey.json' file is either empty or still contains the placeholder text. Please paste your full service account key from the Firebase console.");
    }

    const serviceAccount = JSON.parse(serviceAccountString);

    // Validate the parsed object for key properties
    if (!serviceAccount.project_id) {
        throw new Error("The service account JSON is invalid or incomplete: missing 'project_id'. Please re-download from Firebase.");
    }
     if (!serviceAccount.private_key) {
        throw new Error("The service account JSON is invalid or incomplete: missing 'private_key'. Please re-download from Firebase.");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    
    console.log('Firebase Admin SDK initialized successfully.');
    adminDb = admin.firestore();
    adminAuth = admin.auth();

  } catch (error: any) {
    console.error(
      '\n********************************************************************************\n' +
      '** Firebase Admin SDK initialization failed!                                  **\n' +
      '** ---------------------------------------------------------------------------- **\n' +
      `** Reason: ${error.message}\n` +
      '********************************************************************************\n'
    );
  }
}

// Run the initialization logic when this module is first imported.
initializeFirebaseAdmin();

export { adminDb, adminAuth };
