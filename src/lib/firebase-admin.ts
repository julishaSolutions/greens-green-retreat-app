
import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

// Check if running in a Google Cloud environment (like App Hosting) vs. local
// App Hosting automatically sets APP_HOSTING_APP_ID
const isGoogleCloud = !!process.env.APP_HOSTING_APP_ID;

if (getApps().length === 0) {
    if (isGoogleCloud) {
        console.log('[Firebase Admin] Google Cloud environment detected. Initializing with Application Default Credentials.');
        try {
            admin.initializeApp();
            console.log('✅ [Firebase Admin] SDK initialized successfully using ADC.');
        } catch (error: any) {
            console.error('❌ [CRITICAL ERROR] Firebase Admin SDK initialization failed on Google Cloud.');
            console.error('   This usually means the runtime service account lacks necessary IAM permissions for Firestore.');
            console.error(`   Original Error: ${error.message}`);
        }
    } else {
        console.log('[Firebase Admin] Local environment detected. Initializing with credentials from .env file.');
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const hasCredentials = projectId && clientEmail && privateKey;

        if (hasCredentials) {
            try {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId,
                        clientEmail,
                        privateKey,
                    }),
                });
                console.log('✅ [Firebase Admin] SDK initialized successfully from .env file!');
            } catch (error: any) {
                console.error('❌ [CRITICAL ERROR] Firebase Admin SDK initialization failed with .env credentials.');
                console.error('   Please ensure your .env file contains the correct Firebase service account details.');
                console.error(`   Original Error: ${error.message}`);
            }
        } else {
            console.warn('⚠️ [Firebase Admin] Local environment credentials missing. Server-side features will be disabled.');
        }
    }
}

// Get instances if they haven't been set yet
// This check ensures that we only try to get instances if an app was successfully initialized.
if (getApps().length > 0 && !adminDb) {
    adminDb = admin.firestore();
    adminAuth = admin.auth();
} else if (getApps().length === 0) {
     console.error('❌ [Firebase Admin] Could not get Firestore/Auth instances because no app was initialized.');
}

export { adminDb, adminAuth };
