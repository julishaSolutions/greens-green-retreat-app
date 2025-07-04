'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Wifi, Users, Trees, ShieldCheck, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Cottage = {
  id: string;
  name: string;
  price: number;
  guests: number;
  imageUrls: string[];
  description: string;
  amenities: string[];
  whatsappLink: string;
};

const amenityIcons: { [key: string]: React.ReactNode } = {
    'Wi-Fi': <Wifi className="h-4 w-4" />,
    'Guests': <Users className="h-4 w-4" />,
    'Spacious Deck': <Trees className="h-4 w-4" />,
    '24-hour Security': <ShieldCheck className="h-4 w-4" />,
};

const cottages: Cottage[] = [
  {
    id: 'alma1',
    name: 'Alma 1',
    price: 14000,
    guests: 2,
    imageUrls: ['https://placehold.co/800x600.png', 'https://placehold.co/800x600.png', 'https://placehold.co/800x600.png'],
    description: "A cozy cottage for 1-2 people, Alma 1 is the perfect getaway for your time alone or with your special someone. The cottage is open planned and it can also accommodate a young family with 2 kids ages 5 and below. It's perched right on top of the valley and has amazing views and a private garden.",
    amenities: ['Wi-Fi', 'Spacious Deck', '24-hour Security'],
    whatsappLink: 'https://wa.me/p/9232092633473752/254714281791'
  },
  {
    id: 'double-alma',
    name: 'Double Alma Cottage',
    price: 40000,
    guests: 6,
    imageUrls: ['https://placehold.co/800x600.png', 'https://placehold.co/800x600.png', 'https://placehold.co/800x600.png'],
    description: "This is Double Alma. A two bedroom, one bathroom cottage with an outhouse. The camping site, cultivated with love, promises a night full of laughter and adventure. Maximum capacity is 6 adults. For a comfortable stay, 4 adults and 2 kids. For an even more comfortable stay, a family of 2 adults and 2 kids.",
    amenities: ['Wi-Fi', 'Spacious Deck', '24-hour Security'],
    whatsappLink: 'https://wa.me/p/6310381319079653/254714281791'
  },
  {
    id: 'alma2',
    name: 'Alma 2 Cottage',
    price: 40000,
    guests: 8,
    imageUrls: ['https://placehold.co/800x600.png', 'https://placehold.co/800x600.png', 'https://placehold.co/800x600.png'],
    description: "Alma 2 is our tree house. She is tall, has a downstairs bunker, and can host up to 8 guests. Great for game nights!",
    amenities: ['Wi-Fi', 'Spacious Deck', '24-hour Security'],
    whatsappLink: 'https://wa.me/p/7057512904270008/254714281791'
  }
];

export default function TheRetreatPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center">
        <h1 className={cn('text-4xl md:text-5xl font-bold font-headline text-primary')}>The Suites & Cottages</h1>
        <p className="mt-4 text-lg max-w-3xl mx-auto text-foreground/80 font-body">
          Find your private haven in nature. The love of nature and the outdoors inspired the design of our four distinct cottages, each uniquely placed to appreciate the surrounding environment. Please note that Olivia Cottage is currently unavailable.
        </p>
      </div>
      <Separator className="my-12" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cottages.map((item) => (
          <Card key={item.id} className="overflow-hidden flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300 group">
            <CardHeader className="p-0">
               <Carousel className="w-full">
                <CarouselContent>
                  {item.imageUrls.map((imageUrl, index) => (
                    <CarouselItem key={index}>
                      <div className="relative h-64 w-full">
                        <Image
                          src={imageUrl}
                          alt={`${item.name} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden group-hover:flex bg-background/50 hover:bg-background/80" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden group-hover:flex bg-background/50 hover:bg-background/80" />
              </Carousel>
            </CardHeader>
            <CardContent className="p-6 flex-grow">
              <CardTitle className={cn("font-headline text-2xl")}>{item.name}</CardTitle>
              <p className="text-lg font-semibold text-primary mt-1">Kes {item.price.toLocaleString()} / night</p>
              <CardDescription className="mt-4 text-base font-body">{item.description}</CardDescription>
               <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 font-sans">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Up to {item.guests} guests</span>
                </div>
                {item.amenities.map(amenity => (
                  !amenity.includes('Bedroom') &&
                    <div key={amenity} className="flex items-center gap-2 text-sm text-muted-foreground">
                        {amenityIcons[amenity] || null}
                        <span>{amenity}</span>
                    </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-6 bg-muted/50">
              <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-sans">
                <Link href={item.whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Inquire on WhatsApp
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
