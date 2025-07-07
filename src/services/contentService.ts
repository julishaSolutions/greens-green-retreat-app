
'use server';
import { adminDb } from '@/lib/firebase-admin';
import type { DocumentData, Query } from 'firebase-admin/firestore';

const FIREBASE_NOT_INITIALIZED_WARNING = 'Firestore Admin is not initialized. Cannot fetch data. Please check your server environment configuration.';

export type Cottage = {
  id: string;
  name: string;
  price: number;
  guests: number;
  imageUrls: string[];
  description: string;
  slug?: string;
  [key: string]: any; 
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
    const imageUrls = data.imageUrls || data['imageUrls '] || [];
    const guests = data.guests || data.capacity || 0;

    return {
        id: doc.id,
        name: data.name || '',
        price: data.price || 0,
        guests: guests,
        imageUrls: Array.isArray(imageUrls) ? imageUrls : [imageUrls],
        description: data.description || '',
        slug: data.slug || '',
        ...data,
    };
}

export async function getCottages(count?: number): Promise<Cottage[]> {
    if (!adminDb) {
        console.warn(FIREBASE_NOT_INITIALIZED_WARNING);
        return [];
    }
    try {
        const snapshot = await adminDb.collection('cottages').get();
        
        let cottages = snapshot.docs.map(docToCottage);

        if (count) {
            return cottages.slice(0, count);
        }

        return cottages;
    } catch (error) {
        console.error("Error fetching cottages:", error);
        return [];
    }
}

export async function getCottageBySlug(slug: string): Promise<Cottage | null> {
    if (!adminDb) {
        console.warn(FIREBASE_NOT_INITIALIZED_WARNING);
        return null;
    }
    try {
        const q = adminDb.collection('cottages').where('slug', '==', slug).limit(1);
        const snapshot = await q.get();

        if (snapshot.empty) {
            return null;
        }
        return docToCottage(snapshot.docs[0]);
    } catch (error) {
        console.error(`Error fetching cottage by slug ${slug}:`, error);
        return null;
    }
}

export async function getActivities(): Promise<Activity[]> {
    if (!adminDb) {
        console.warn(FIREBASE_NOT_INITIALIZED_WARNING);
        return [];
    }
    try {
        const snapshot = await adminDb.collection('activities').get();

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name || '',
                description: data.description || '',
                imageUrl: data.imageUrl || data['imageUrl '] || '', 
                imageHint: data.imageHint || '',
                ...data,
            }
        });
    } catch (error) {
        console.error("Error fetching activities:", error);
        return [];
    }
}
