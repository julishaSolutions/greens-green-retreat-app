
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { Wifi, Users, Trees, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Cottage } from '@/services/contentService';

const amenityIcons: { [key: string]: React.ReactNode } = {
    'Wi-Fi': <Wifi className="h-4 w-4" />,
    'Guests': <Users className="h-4 w-4" />,
    'Spacious Deck': <Trees className="h-4 w-4" />,
    '24-hour Security': <ShieldCheck className="h-4 w-4" />,
};

const staticAmenities = ['Wi-Fi', 'Spacious Deck', '24-hour Security'];

export function RetreatView({ cottages }: { cottages: Cottage[] }) {

  if (!cottages || cottages.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-headline text-primary">No Cottages Found</h2>
        <p className="text-foreground/70 mt-4 font-sans">
          We couldn't load the cottage information at this time. Please try again later.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {cottages.map((item) => {
        const validImageUrls = Array.isArray(item.imageUrls)
          ? item.imageUrls.filter(url => typeof url === 'string' && url.trim() !== '')
          : [];
        const isOliviaCottage = item.name === 'Olivia Cottage';

        return (
          <Card key={item.id} id={item.id} className="relative overflow-hidden flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300 group scroll-mt-24">
            {isOliviaCottage && (
              <div className="absolute top-4 -right-11 bg-primary text-primary-foreground text-center font-bold py-1 px-10 transform rotate-45 z-10 shadow-lg text-sm">
                Fully Booked
              </div>
            )}
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
               {isOliviaCottage ? (
                <Button className="w-full font-sans" disabled>
                  Fully Booked for the Year
                </Button>
              ) : (
                <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-sans">
                  <Link href={`/booking?cottageId=${item.id}&cottageName=${encodeURIComponent(item.name)}`}>Book Now</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
