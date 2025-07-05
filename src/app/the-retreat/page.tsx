
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Wifi, Users, Trees, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

type Cottage = {
  id: string;
  name: string;
  price: number;
  guests: number;
  imageUrls: string[];
  'imageUrls '?: string[]; // Handle potential trailing space
  description: string;
  whatsappLink?: string;
  slug?: string;
};

const amenityIcons: { [key: string]: React.ReactNode } = {
    'Wi-Fi': <Wifi className="h-4 w-4" />,
    'Guests': <Users className="h-4 w-4" />,
    'Spacious Deck': <Trees className="h-4 w-4" />,
    '24-hour Security': <ShieldCheck className="h-4 w-4" />,
};

const staticAmenities = ['Wi-Fi', 'Spacious Deck', '24-hour Security'];

export default function TheRetreatPage() {
  const [cottages, setCottages] = useState<Cottage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
        setLoading(false);
        return;
    }
    const q = query(collection(db, 'cottages'), where('name', '!=', 'Olivia Cottage'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cottagesData: Cottage[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Cottage));
      setCottages(cottagesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 scroll-mt-20">
      <div className="text-center">
        <h1 className={cn('text-4xl md:text-5xl font-bold font-headline text-primary')}>The Suites & Cottages</h1>
        <p className="mt-4 text-lg max-w-3xl mx-auto text-foreground/80 font-body">
          Find your private haven in nature. The love of nature and the outdoors inspired the design of our distinct cottages, each uniquely placed to appreciate the surrounding environment.
        </p>
      </div>
      <Separator className="my-12" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="overflow-hidden flex flex-col shadow-lg">
                    <CardHeader className="p-0">
                        <Skeleton className="h-64 w-full" />
                    </CardHeader>
                    <CardContent className="p-6 flex-grow">
                        <Skeleton className="h-8 w-3/4 mb-2" />
                        <Skeleton className="h-6 w-1/4 mb-4" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-5/6 mb-4" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                    <CardFooter className="p-6 bg-muted/50">
                        <Skeleton className="h-10 w-full" />
                    </CardFooter>
                </Card>
            ))
        ) : (
          cottages.map((item) => {
            const imageUrls = item.imageUrls || item['imageUrls '];
            const validImageUrls = Array.isArray(imageUrls)
              ? imageUrls.filter(url => typeof url === 'string' && url.trim() !== '')
              : [];

            return (
              <Card key={item.id} id={item.id} className="overflow-hidden flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300 group scroll-mt-24">
                <CardHeader className="p-0">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {validImageUrls.length > 0 ? (
                        validImageUrls.map((imageUrl, index) => (
                          <CarouselItem key={index}>
                            <div className="relative h-64 w-full">
                              <Image
                                src={imageUrl}
                                alt={`${item.name} - Image ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(min-width: 768px) 50vw, 100vw"
                              />
                            </div>
                          </CarouselItem>
                        ))
                      ) : (
                         <CarouselItem>
                            <div className="relative h-64 w-full">
                              <Image
                                src="https://placehold.co/800x600.png"
                                alt={`${item.name} - Placeholder Image`}
                                fill
                                className="object-cover"
                                sizes="(min-width: 768px) 50vw, 100vw"
                                data-ai-hint="luxury cottage interior"
                              />
                            </div>
                          </CarouselItem>
                      )}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden group-hover:flex bg-background/50 hover:bg-background/80" />
                    <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden group-hover:flex bg-background/50 hover:bg-background/80" />
                  </Carousel>
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                  <CardTitle className={cn("font-headline text-2xl")}>
                    {item.slug ? (
                      <Link href={`/cottages/${item.slug}`} className="hover:text-primary transition-colors">{item.name}</Link>
                    ) : (
                      item.name
                    )}
                  </CardTitle>
                  <p className="text-lg font-semibold text-primary mt-1">Kes {item.price?.toLocaleString() || 'N/A'} / night</p>
                  <CardDescription className="mt-4 text-base font-body">{item.description}</CardDescription>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 font-sans">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Up to {item.guests} guests</span>
                    </div>
                    {staticAmenities.map(amenity => (
                        <div key={amenity} className="flex items-center gap-2 text-sm text-muted-foreground">
                            {amenityIcons[amenity] || null}
                            <span>{amenity}</span>
                        </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-6 bg-muted/50">
                  <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-sans">
                    <Link href="/booking">Book Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
