
'use client';

import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Wifi, Users, Trees, ShieldCheck, ChevronLeft, ChevronRight, CalendarX } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { Cottage } from '@/services/contentService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type CottageNavItem = {
    id: string;
    slug: string;
    name: string;
}

type CottageDetailViewProps = {
    cottage: Cottage;
    allCottages: CottageNavItem[];
};

const amenityIcons: { [key: string]: React.ReactNode } = {
    'Wi-Fi': <Wifi className="h-5 w-5 text-primary" />,
    'Guests': <Users className="h-5 w-5 text-primary" />,
    'Spacious Deck': <Trees className="h-5 w-5 text-primary" />,
    '24-hour Security': <ShieldCheck className="h-5 w-5 text-primary" />,
};

const staticAmenities = ['Wi-Fi', 'Spacious Deck', '24-hour Security'];

export function CottageDetailView({ cottage, allCottages }: CottageDetailViewProps) {
  const isOliviaCottage = cottage.name === 'Olivia Cottage';
  const cottageIndex = allCottages.findIndex(c => c.slug === cottage.slug);
  
  let prevCottage: CottageNavItem | null = null;
  let nextCottage: CottageNavItem | null = null;
  
  if (cottageIndex !== -1 && allCottages.length > 1) {
      const prevIndex = (cottageIndex - 1 + allCottages.length) % allCottages.length;
      const nextIndex = (cottageIndex + 1) % allCottages.length;
  
      if (allCottages[prevIndex]?.slug !== cottage.slug) {
          prevCottage = allCottages[prevIndex];
      }
      if (allCottages[nextIndex]?.slug !== cottage.slug) {
          nextCottage = allCottages[nextIndex];
      }
  }


  const validImageUrls = Array.isArray(cottage.imageUrls)
    ? cottage.imageUrls.filter(url => typeof url === 'string' && url.trim() !== '')
    : [];

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      {isOliviaCottage && (
        <Alert variant="destructive" className="mb-8 max-w-5xl mx-auto border-2">
          <CalendarX className="h-4 w-4" />
          <AlertTitle className="font-bold">Fully Booked for the Year</AlertTitle>
          <AlertDescription>
            We are sorry, Olivia Cottage is fully booked. Please feel free to explore our other lovely cottages.
          </AlertDescription>
        </Alert>
      )}

      <Carousel className="w-full max-w-5xl mx-auto group mb-12">
        <CarouselContent>
          {validImageUrls.length > 0 ? (
            validImageUrls.map((imageUrl, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[50vh] md:h-[70vh] w-full rounded-lg overflow-hidden shadow-xl">
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
              <div className="relative h-[50vh] md:h-[70vh] w-full bg-muted rounded-lg flex items-center justify-center">
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
        <div className="mb-8 text-center">
          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center">
            {prevCottage ? (
              <Button asChild variant="outline" className="w-48 justify-start">
                <Link href={`/cottages/${prevCottage.slug}`}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {prevCottage.name}
                </Link>
              </Button>
            ) : <div className="w-48" />}
            <h1 className={cn('flex-1 text-4xl md:text-5xl font-bold font-headline text-primary')}>{cottage.name}</h1>
            {nextCottage ? (
              <Button asChild variant="outline" className="w-48 justify-end">
                <Link href={`/cottages/${nextCottage.slug}`}>
                  {nextCottage.name}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : <div className="w-48" />}
          </div>
          
          {/* Mobile Header */}
          <div className="md:hidden">
            <h1 className={cn('text-4xl font-bold font-headline text-primary mb-4')}>{cottage.name}</h1>
            <div className="flex justify-between items-center w-full">
              {prevCottage ? (
                <Button asChild variant="outline" size="icon">
                  <Link href={`/cottages/${prevCottage.slug}`} aria-label={`Previous Cottage: ${prevCottage.name}`}>
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                </Button>
              ) : <div className="w-10 h-10" />}
              {nextCottage ? (
                <Button asChild variant="outline" size="icon">
                  <Link href={`/cottages/${nextCottage.slug}`} aria-label={`Next Cottage: ${nextCottage.name}`}>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : <div className="w-10 h-10" />}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="md:col-span-2">
                <h2 className={cn('text-3xl font-bold font-headline text-primary mb-4')}>Description</h2>
                <div className="prose prose-lg max-w-none text-foreground/80 font-body">
                  <p>{cottage.description}</p>
                </div>
            </div>
            <div className="md:col-span-1">
                <Card className="md:sticky md:top-24 shadow-lg">
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
                              {isOliviaCottage ? (
                                <Button className="w-full font-sans mt-4" size="lg" disabled>
                                  Fully Booked
                                </Button>
                              ) : (
                                <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-sans mt-4" size="lg">
                                  <Link href={`/booking?cottageId=${cottage.id}&cottageName=${encodeURIComponent(cottage.name)}`}>
                                    Book Now
                                  </Link>
                                </Button>
                              )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
