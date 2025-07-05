
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Wifi, Users, Trees, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { getConfirmedBookings } from '@/services/bookingService';
import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';

type Cottage = {
  id: string;
  name: string;
  price: number;
  guests: number;
  imageUrls: string[];
  description: string;
  whatsappLink?: string;
  slug?: string;
};

type CottageNavItem = {
    id: string;
    slug: string;
    name: string;
}

const amenityIcons: { [key: string]: React.ReactNode } = {
    'Wi-Fi': <Wifi className="h-5 w-5 text-primary" />,
    'Guests': <Users className="h-5 w-5 text-primary" />,
    'Spacious Deck': <Trees className="h-5 w-5 text-primary" />,
    '24-hour Security': <ShieldCheck className="h-5 w-5 text-primary" />,
};

const staticAmenities = ['Wi-Fi', 'Spacious Deck', '24-hour Security'];

export default function CottageDetailPage() {
  const params = useParams<{ slug: string }>();
  const [cottage, setCottage] = useState<Cottage | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookedDates, setBookedDates] = useState<DateRange[]>([]);
  const [allCottages, setAllCottages] = useState<CottageNavItem[]>([]);

  useEffect(() => {
    const slug = params.slug;
    if (!slug || !db) {
      setLoading(false);
      return;
    }

    const fetchCottageData = async () => {
      setLoading(true);
      try {
        // Fetch current cottage
        const q = query(collection(db, 'cottages'), where('slug', '==', slug), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const cottageData = { id: doc.id, ...doc.data() } as Cottage;
          // Handle potential trailing space in property name
          cottageData.imageUrls = (cottageData as any).imageUrls || (cottageData as any)['imageUrls '] || [];
          setCottage(cottageData);

          // Fetch bookings for this cottage
          try {
              const bookings = await getConfirmedBookings(cottageData.id);
              setBookedDates(bookings);
          } catch (bookingError) {
              console.error("Error fetching bookings:", bookingError);
          }

        } else {
            console.warn(`No cottage found with slug: '${slug}'`);
        }
        
        // Fetch all cottages for navigation
        const allCottagesQuery = query(collection(db, 'cottages'), where('name', '!=', 'Olivia Cottage'));
        const allCottagesSnapshot = await getDocs(allCottagesQuery);
        const cottageList = allCottagesSnapshot.docs.map(doc => ({
            id: doc.id,
            slug: doc.data().slug || '',
            name: doc.data().name || ''
        }));
        cottageList.sort((a, b) => a.name.localeCompare(b.name));
        setAllCottages(cottageList);

      } catch (error) {
        console.error("Error fetching cottage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCottageData();
  }, [params.slug]);

  const cottageIndex = allCottages.findIndex(c => c.slug === params.slug);
  let prevCottage: CottageNavItem | null = null;
  let nextCottage: CottageNavItem | null = null;
  
  if (cottageIndex !== -1 && allCottages.length > 1) {
    const prevIndex = (cottageIndex - 1 + allCottages.length) % allCottages.length;
    const nextIndex = (cottageIndex + 1) % allCottages.length;
    prevCottage = allCottages[prevIndex];
    nextCottage = allCottages[nextIndex];
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20">
        <Skeleton className="h-12 w-1/2 mb-4" />
        <Skeleton className="h-[60vh] w-full mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-4" />
            </div>
            <div>
                 <Skeleton className="h-48 w-full" />
            </div>
        </div>
      </div>
    );
  }

  if (!cottage) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20 text-center">
        <h1 className="text-3xl font-bold">Cottage Not Found</h1>
        <p className="mt-4">The cottage you are looking for does not exist.</p>
        <Button asChild className="mt-8">
          <Link href="/the-retreat">Back to all cottages</Link>
        </Button>
      </div>
    );
  }

  const imageUrls = cottage?.imageUrls;
  const validImageUrls = Array.isArray(imageUrls)
    ? imageUrls.filter(url => typeof url === 'string' && url.trim() !== '')
    : [];

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <Carousel className="w-full max-w-5xl mx-auto group mb-12">
        <CarouselContent>
          {validImageUrls.length > 0 ? (
            validImageUrls.map((imageUrl, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[70vh] w-full rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src={imageUrl}
                    alt={`${cottage.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 90vw, 1200px"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem>
              <div className="relative h-[70vh] w-full bg-muted rounded-lg flex items-center justify-center">
                 <Image
                    src="https://placehold.co/1200x800.png"
                    alt={`${cottage.name} - Placeholder Image`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 90vw, 1200px"
                    priority
                    data-ai-hint="luxury cottage interior"
                  />
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden group-hover:flex bg-background/50 hover:bg-background/80" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden group-hover:flex bg-background/50 hover:bg-background/80" />
      </Carousel>

      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10 text-center">
            {prevCottage ? (
                <Button asChild variant="outline" className="hidden md:flex w-48 justify-start">
                    <Link href={`/cottages/${prevCottage.slug}`}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        {prevCottage.name}
                    </Link>
                </Button>
            ) : <div className="hidden md:block w-48" />}
            
            <h1 className={cn('flex-1 text-4xl md:text-5xl font-bold font-headline text-primary')}>{cottage.name}</h1>
            
            {nextCottage ? (
                <Button asChild variant="outline" className="hidden md:flex w-48 justify-end">
                    <Link href={`/cottages/${nextCottage.slug}`}>
                        {nextCottage.name}
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            ) : <div className="hidden md:block w-48" />}
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="md:col-span-2">
                <h2 className={cn('text-3xl font-bold font-headline text-primary mb-4')}>Description</h2>
                <div className="prose prose-lg max-w-none text-foreground/80 font-body">
                  <p>{cottage.description}</p>
                </div>
            </div>
            <div className="md:col-span-1">
                <Card className="sticky top-24 shadow-lg">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                             <div>
                                <p className="text-2xl font-bold text-primary font-headline">Kes {cottage.price?.toLocaleString() || 'N/A'}</p>
                                <p className="text-muted-foreground font-sans">per night</p>
                            </div>
                            <Separator />
                             <h3 className="font-bold font-headline text-lg text-primary">Availability</h3>
                            <div className="flex justify-center">
                                <Calendar
                                    mode="multiple"
                                    disabled={[{ before: new Date(new Date().setDate(new Date().getDate() - 1)) }, ...bookedDates]}
                                    className="rounded-md border p-0"
                                    numberOfMonths={1}
                                />
                            </div>
                            <Separator />
                             <h3 className="font-bold font-headline text-lg text-primary">Amenities</h3>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 text-muted-foreground font-sans">
                                  <Users className="h-5 w-5 text-primary" />
                                  <span>Up to {cottage.guests} guests</span>
                              </div>
                              {staticAmenities.map(amenity => (
                                  <div key={amenity} className="flex items-center gap-3 text-muted-foreground font-sans">
                                      {amenityIcons[amenity] || null}
                                      <span>{amenity}</span>
                                  </div>
                              ))}
                            </div>
                             <Separator />
                             <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-sans mt-4" size="lg">
                                <Link href="/booking">
                                  Book Now
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
