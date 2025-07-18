
'use server';

import { getCottages } from '@/services/contentService';
import type { Cottage } from '@/services/contentService';

export async function getCottagesForHomepage(): Promise<Cottage[]> {
    try {
        const cottages = await getCottages(3);
        return cottages;
    } catch (error) {
        console.error("Failed to fetch cottages for homepage:", error);
        // In case of an error, return an empty array to prevent the client from crashing.
        return [];
    }
}
