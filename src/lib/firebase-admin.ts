
import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import fs from 'fs';
import path from 'path';

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

// This function will only run ONCE on server startup.
function initializeAdmin() {
  // Check if already initialized to prevent re-initialization on hot reloads
  if (getApps().length > 0) {
    const app = getApps()[0];
    if (app) {
        try {
            if (!adminDb) adminDb = admin.firestore(app);
            if (!adminAuth) adminAuth = admin.auth(app);
            return;
        } catch (e) {
            // This might happen if the app was initialized but is no longer valid.
            // Allow the process to continue to re-initialize.
        }
    }
  }

  const serviceAccountPath = path.resolve(process.cwd(), 'src/lib/serviceAccountKey.json');

  // STAGE 1: Check if the file exists
  if (!fs.existsSync(serviceAccountPath)) {
    console.error('\n********************************************************************************');
    console.error('** [SETUP ERROR] The file `src/lib/serviceAccountKey.json` was not found.       **');
    console.error('** Please create this file and paste your service account key into it.        **');
    console.error('********************************************************************************\n');
    return;
  }

  // STAGE 2: Read and check if file is empty or placeholder
  const serviceAccountString = fs.readFileSync(serviceAccountPath, 'utf-8');
  if (!serviceAccountString.trim() || serviceAccountString.includes('please_paste_your_key_here')) {
    console.error('\n********************************************************************************');
    console.error('** [SETUP ERROR] `serviceAccountKey.json` is empty or has placeholder text.     **');
    console.error('** Please paste your full service account key into this file.                 **');
    console.error('********************************************************************************\n');
    return;
  }

  // STAGE 3: Try to parse the file as JSON
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountString);
  } catch (e: any) {
    console.error('\n********************************************************************************');
    console.error('** [SETUP ERROR] The `serviceAccountKey.json` file is not valid JSON.           **');
    console.error('** It may have a syntax error (e.g., a missing comma or quote).               **');
    console.error(`** Details: ${e.message}`);
    console.error('********************************************************************************\n');
    return;
  }
  
  // STAGE 4: Final attempt to initialize
  try {
    // THIS IS THE KEY FIX: Explicitly format the private key
    if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    adminDb = admin.firestore();
    adminAuth = admin.auth();
    console.log('\n***************************************************');
    console.log('**   Firebase Admin SDK initialized successfully!  **');
    console.log('***************************************************\n');
  } catch (error: any) {
    console.error('\n********************************************************************************');
    console.error('** [CRITICAL ERROR] Firebase Admin SDK initialization failed.                   **');
    console.error('** The `serviceAccountKey.json` file appears valid, but the SDK rejected it.    **');
    console.error('** This could be due to:                                                      **');
    console.error('**  1. A copy-paste error in the "private_key" value.                         **');
    console.error('**  2. The service account being disabled in the Google Cloud console.        **');
    console.error('**  3. The project ID in the key not matching your actual Firebase project.   **');
    console.error('** -------------------------------------------------------------------------- **');
    console.error(`** Original Error: ${error.message}`);
    console.error('********************************************************************************\n');
  }
}

initializeAdmin();

export { adminDb, adminAuth };
