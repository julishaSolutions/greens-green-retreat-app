
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Wifi, Users, Trees, ShieldCheck, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

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

  useEffect(() => {
    const slug = params.slug;
    if (!slug || !db) {
      setLoading(false);
      return;
    }

    const fetchCottage = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'cottages'), where('slug', '==', slug), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const cottageData = { id: doc.id, ...doc.data() } as Cottage;
          setCottage(cottageData);
        } else {
            console.warn(`No cottage found with slug: '${slug}'`);
        }
      } catch (error) {
        console.error("Error fetching cottage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCottage();
  }, [params.slug]);

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

  const imageUrls = cottage?.imageUrls || (cottage as any)?.['imageUrls '];
  const validImageUrls = Array.isArray(imageUrls)
    ? imageUrls.filter(url => typeof url === 'string' && url.trim() !== '')
    : [];
    
  const linkProps = cottage.whatsappLink
    ? { href: cottage.whatsappLink, target: '_blank', rel: 'noopener noreferrer' }
    : { href: '/inquire' };
  const linkText = cottage.whatsappLink ? 'Inquire on WhatsApp' : 'Inquire Now';

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
        <div className="text-center mb-10">
             <h1 className={cn('text-4xl md:text-5xl font-bold font-headline text-primary')}>{cottage.name}</h1>
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
                                <Link {...linkProps}>
                                <MessageCircle className="mr-2 h-4 w-4" />
                                {linkText}
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
