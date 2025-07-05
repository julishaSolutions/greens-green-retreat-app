
import { getCottageBySlug, getCottages } from '@/services/contentService';
import { getConfirmedBookings } from '@/services/bookingService';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
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
        return (
          <div className="container mx-auto px-4 py-12 md:py-20 text-center">
            <h1 className="text-3xl font-bold">Cottage Not Found</h1>
            <p className="mt-4">The cottage you are looking for does not exist or is currently unavailable.</p>
            <Button asChild className="mt-8">
              <Link href="/the-retreat">Back to all cottages</Link>
            </Button>
          </div>
        );
    }
    
    // Fetch bookings and all cottages in parallel for efficiency
    const [bookedDates, allCottagesData] = await Promise.all([
        getConfirmedBookings(cottage.id),
        getCottages() 
    ]);

    const allCottages = allCottagesData.map(c => ({
        id: c.id,
        slug: c.slug || '',
        name: c.name || ''
    }));

    return <CottageDetailView cottage={cottage} bookedDates={bookedDates} allCottages={allCottages} />;
}
