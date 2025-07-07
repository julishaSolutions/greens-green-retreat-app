
import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import fs from 'fs';
import path from 'path';

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

try {
  // Check if already initialized to prevent re-initialization on hot reloads
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
  
  // Assign the services after successful initialization
  adminDb = admin.firestore();
  adminAuth = admin.auth();

} catch (error: any) {
    console.error('\n********************************************************************************');
    console.error('** [CRITICAL ERROR] Firebase Admin SDK initialization failed.                   **');
    console.error(`** Details: ${error.message}`);
    console.error('********************************************************************************\n');
}

export { adminDb, adminAuth };
