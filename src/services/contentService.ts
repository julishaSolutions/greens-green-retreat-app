
'use server';
import { adminDb } from '@/lib/firebase-admin';
import type { DocumentData, Query } from 'firebase-admin/firestore';

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
    // Handle potential field name inconsistencies from Firestore
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
    let q: Query = adminDb.collection('cottages');
    
    if (count) {
        q = q.limit(count);
    }

    const snapshot = await q.get();
    return snapshot.docs.map(docToCottage);
}

export async function getCottageBySlug(slug: string): Promise<Cottage | null> {
    const q = adminDb.collection('cottages').where('slug', '==', slug).limit(1);
    const snapshot = await q.get();

    if (snapshot.empty) {
        return null;
    }
    return docToCottage(snapshot.docs[0]);
}

export async function getActivities(): Promise<Activity[]> {
    const snapshot = await adminDb.collection('activities').get();
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name || '',
            description: data.description || '',
            // Handle both string and array for imageUrl
            imageUrl: data.imageUrl || data['imageUrl '] || '', 
            imageHint: data.imageHint || '',
            ...data,
        }
    });
}
