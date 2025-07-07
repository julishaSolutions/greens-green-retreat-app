
import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import fs from 'fs';
import path from 'path';

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

function performDiagnostics() {
  console.log('\n--- Firebase Admin Initialization Diagnostics ---');
  const serviceAccountPath = path.resolve(process.cwd(), 'src/lib/serviceAccountKey.json');
  console.log(`[DIAGNOSTIC] Checking for service account file at: ${serviceAccountPath}`);

  if (!fs.existsSync(serviceAccountPath)) {
    console.error('\n********************************************************************************');
    console.error('** [DIAGNOSTIC] FAILURE: The file `src/lib/serviceAccountKey.json` was not found. **');
    console.error('** Please create this file and paste your service account key into it.        **');
    console.error('********************************************************************************\n');
    console.log('--- End Diagnostics ---\n');
    return;
  }
  console.log('[DIAGNOSTIC] SUCCESS: File exists.');

  const serviceAccountString = fs.readFileSync(serviceAccountPath, 'utf-8');
  if (!serviceAccountString.trim() || serviceAccountString.includes('please_paste_your_key_here')) {
    console.error('\n********************************************************************************');
    console.error('** [DIAGNOSTIC] FAILURE: `serviceAccountKey.json` is empty or has a placeholder. **');
    console.error('** Please paste your full service account key into this file.                 **');
    console.error('********************************************************************************\n');
    console.log('--- End Diagnostics ---\n');
    return;
  }
  console.log('[DIAGNOSTIC] SUCCESS: File is not empty and does not contain placeholder text.');

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountString);
    console.log('[DIAGNOSTIC] SUCCESS: File content was successfully parsed as JSON.');
  } catch (e: any) {
    console.error('\n********************************************************************************');
    console.error('** [DIAGNOSTIC] FAILURE: The `serviceAccountKey.json` file is not valid JSON.    **');
    console.error('** Please re-copy the entire file from the Firebase console.                  **');
    console.error(`** Details: ${e.message}`);
    console.error('********************************************************************************\n');
    console.log('--- End Diagnostics ---\n');
    return;
  }

  const requiredKeys = ['type', 'project_id', 'private_key_id', 'private_key', 'client_email'];
  const missingKeys = requiredKeys.filter(key => !(key in serviceAccount));

  if (missingKeys.length > 0) {
      console.error('\n********************************************************************************');
      console.error('** [DIAGNOSTIC] FAILURE: The service account JSON is missing required keys.     **');
      console.error(`** Missing Keys: [${missingKeys.join(', ')}]`);
      console.error('** Please ensure you have copied the ENTIRE service account file.             **');
      console.error('********************************************************************************\n');
      console.log('--- End Diagnostics ---\n');
      return;
  }
  console.log('[DIAGNOSTIC] SUCCESS: All required keys are present in the JSON object.');
  console.log('--- End Diagnostics ---\n');
  
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    adminDb = admin.firestore();
    adminAuth = admin.auth();
    console.log('\n***************************************************');
    console.log('**   Firebase Admin SDK initialized successfully!  **');
    console.log('***************************************************\n');
  } catch(error: any) {
      console.error('\n********************************************************************************');
      console.error('** [DIAGNOSTIC] FINAL FAILURE: SDK initialization failed unexpectedly.         **');
      console.error(`** Reason: ${error.message}`);
      console.error('** The credentials appear valid, but the SDK rejected them.                 **');
      console.error('********************************************************************************\n');
  }
}

if (getApps().length === 0) {
    performDiagnostics();
} else {
    adminDb = admin.firestore();
    adminAuth = admin.auth();
}

export { adminDb, adminAuth };
