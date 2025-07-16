
// This file is server-only and should not be exposed to the client.
// It securely holds the service account credentials for the Firebase Admin SDK.

if (!process.env.SERVICE_ACCOUNT_KEY) {
    throw new Error('CRITICAL: SERVICE_ACCOUNT_KEY environment variable is not set.');
}

export const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
