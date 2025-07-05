
'use server';
import { adminDb } from '@/lib/firebase-admin';
import type { DocumentData, Query } from 'firebase-admin/firestore';

const ADMIN_DB_ERROR_MESSAGE = 'Firestore Admin is not initialized. This is likely due to missing or incorrect Firebase Admin credentials in your .env.local file. Please check your configuration and restart the server.';

export type Cottage = {
  id: string;
  name: string;
  price: number;
  guests: number;
  imageUrls: string[];
  description: string;
  slug?: string;
  [key: string]: any; // To handle fields with spaces like 'imageUrls '
};

export type Activity = {
  id: string;
  name: string;
  description: string;
  imageUrl: string | string[];
  imageHint?: string;
  [key: string]: any;
};

function docToCottage(doc: DocumentData): Cottage {
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name || '',
        price: data.price || 0,
        guests: data.capacity || data.guests || 0,
        imageUrls: data.imageUrls || data['imageUrls '] || [],
        description: data.description || '',
        slug: data.slug || '',
        ...data,
    };
}

export async function getCottages(count?: number): Promise<Cottage[]> {
    if (!adminDb) {
        console.warn(ADMIN_DB_ERROR_MESSAGE);
        return [];
    }
    
    let q: Query = adminDb.collection('cottages');
    
    if (count) {
        q = q.limit(count);
    }

    const snapshot = await q.get();
    return snapshot.docs.map(docToCottage);
}

export async function getCottageBySlug(slug: string): Promise<Cottage | null> {
    if (!adminDb) {
        console.warn(ADMIN_DB_ERROR_MESSAGE);
        return null;
    }

    const q = adminDb.collection('cottages').where('slug', '==', slug).limit(1);
    const snapshot = await q.get();

    if (snapshot.empty) {
        return null;
    }
    return docToCottage(snapshot.docs[0]);
}

export async function getActivities(): Promise<Activity[]> {
    if (!adminDb) {
        console.warn(ADMIN_DB_ERROR_MESSAGE);
        return [];
    }
    
    const snapshot = await adminDb.collection('activities').get();
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Activity));
}
