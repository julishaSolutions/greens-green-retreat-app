

import { getCottageBySlug, getCottages } from '@/services/contentService';
import { notFound } from 'next/navigation';
import { CottageDetailView } from './components/cottage-detail-view';
import { Skeleton } from '@/components/ui/skeleton';

type CottagePageProps = {
    params: {
        slug: string;
    };
};

export default async function CottageDetailPage({ params }: CottagePageProps) {
    const { slug } = params;
    
    // Fetch cottage data first
    const cottage = await getCottageBySlug(slug);

    if (!cottage) {
        notFound();
    }
    
    const allCottagesData = await getCottages();

    const allCottages = allCottagesData.map(c => ({
        id: c.id,
        slug: c.slug || '',
        name: c.name || ''
    }));

    return <CottageDetailView cottage={cottage} allCottages={allCottages} />;
}
