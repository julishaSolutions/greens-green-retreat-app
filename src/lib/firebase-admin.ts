
import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import fs from 'fs';
import path from 'path';

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

try {
  if (getApps().length === 0) {
    const serviceAccountPath = path.resolve(process.cwd(), 'src/lib/serviceAccountKey.json');
    
    if (!fs.existsSync(serviceAccountPath)) {
        throw new Error('The file `src/lib/serviceAccountKey.json` was not found. Please create this file and paste your service account key into it.');
    }

    const serviceAccountString = fs.readFileSync(serviceAccountPath, 'utf-8');

    if (!serviceAccountString.trim() || serviceAccountString.includes('please_paste_your_key_here')) {
        throw new Error('`serviceAccountKey.json` is empty or has placeholder text. Please paste your full service account key into this file.');
    }

    const serviceAccount = JSON.parse(serviceAccountString);

    // THIS IS A CRITICAL FIX for environments that mishandle newline characters.
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('***************************************************');
    console.log('**   Firebase Admin SDK initialized successfully!  **');
    console.log('***************************************************');
  }
  
  adminDb = admin.firestore();
  adminAuth = admin.auth();

} catch (error: any) {
    console.error('\n********************************************************************************');
    console.error('** [CRITICAL ERROR] Firebase Admin SDK initialization failed.                   **');
    if (error.message.includes('INTERNAL')) {
         console.error('** The `serviceAccountKey.json` file appears valid, but the SDK rejected it.    **');
         console.error('** This could be due to:                                                      **');
         console.error('**  1. A copy-paste error in the "private_key" value.                         **');
         console.error('**  2. The service account being disabled in the Google Cloud console.        **');
         console.error('**  3. The project ID in the key not matching your actual Firebase project.   **');
         console.error('** -------------------------------------------------------------------------- **');
         console.error(`** Original Error: ${error.message}`);
    } else {
        console.error(`** Details: ${error.message}`);
    }
    console.error('********************************************************************************\n');
}

export { adminDb, adminAuth };
