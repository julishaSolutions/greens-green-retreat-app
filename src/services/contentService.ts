
import { adminDb } from '@/lib/firebase-admin';
import type { DocumentData } from 'firebase-admin/firestore';

export type Cottage = {
  id: string;
  name: string;
  price: number;
  guests: number;
  imageUrls: string[];
  description: string;
  slug: string;
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
        imageUrls: Array.isArray(imageUrls) ? imageUrls.filter(url => typeof url === 'string' && url) : (typeof imageUrls === 'string' ? [imageUrls] : []),
        description: data.description || '',
        slug: data.slug || '',
        ...data,
    };
}

export async function getCottages(count?: number): Promise<Cottage[]> {
    try {
        const db = adminDb();
        const snapshot = await db.collection('cottages').get();
        
        let cottages = snapshot.docs.map(docToCottage);

        if (count) {
            return cottages.slice(0, count);
        }

        return cottages;
    } catch (error) {
        console.error("Error fetching cottages:", error);
        throw new Error(`Failed to fetch cottages.`);
    }
}

export async function getCottageBySlug(slug: string): Promise<Cottage | null> {
    if (!slug) return null;
    try {
        const db = adminDb();
        const q = db.collection('cottages').where('slug', '==', slug).limit(1);
        const snapshot = await q.get();

        if (snapshot.empty) {
            return null;
        }
        return docToCottage(snapshot.docs[0]);
    } catch (error) {
        console.error(`Error fetching cottage by slug ${slug}:`, error);
        throw new Error(`Failed to fetch cottage by slug ${slug}.`);
    }
}

export async function getActivities(): Promise<Activity[]> {
    try {
        const db = adminDb();
        const snapshot = await db.collection('activities').get();

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
        throw new Error(`Failed to fetch activities.`);
    }
}
