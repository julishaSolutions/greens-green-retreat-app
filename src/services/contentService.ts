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
        console.error('Firestore Admin is not initialized.');
        return [];
    }
    try {
        let q: Query = adminDb.collection('cottages')
            .where('name', '!=', 'Olivia Cottage')
            .orderBy('name');
        
        if (count) {
            q = q.limit(count);
        }

        const snapshot = await q.get();
        return snapshot.docs.map(docToCottage);
    } catch (error) {
        console.error("Error fetching cottages: ", error);
        return [];
    }
}

export async function getCottageBySlug(slug: string): Promise<Cottage | null> {
    if (!adminDb) {
        console.error('Firestore Admin is not initialized.');
        return null;
    }
    try {
        const q = adminDb.collection('cottages').where('slug', '==', slug).limit(1);
        const snapshot = await q.get();
        if (snapshot.empty) {
            console.warn(`No cottage found with slug: '${slug}'`);
            return null;
        }
        return docToCottage(snapshot.docs[0]);
    } catch (error) {
        console.error(`Error fetching cottage with slug ${slug}:`, error);
        return null;
    }
}

export async function getActivities(): Promise<Activity[]> {
    if (!adminDb) {
        console.error('Firestore Admin is not initialized.');
        return [];
    }
    try {
        const snapshot = await adminDb.collection('activities').get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Activity));
    } catch (error) {
        console.error("Error fetching activities: ", error);
        return [];
    }
}
