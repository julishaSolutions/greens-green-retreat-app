import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Wifi, Users, Trees, Utensils, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const accommodations = [
  {
    name: 'Alma 1 Cottage',
    price: 18500,
    guests: 2,
    images: [
      { src: 'https://placehold.co/800x600.png', hint: 'cozy cottage valley' },
      { src: 'https://placehold.co/800x600.png', hint: 'romantic cottage interior' },
      { src: 'https://placehold.co/800x600.png', hint: 'valley view deck' },
    ],
    description: 'A cozy hideaway for 2, this cottage is perched in the valley with stunning views, making it perfect for couples or solo travelers seeking a peaceful escape.',
    amenities: ['1 Bedroom', 'Wi-Fi', 'Fully Equipped Kitchen', 'Spacious Deck', '24-hour Security'],
  },
  {
    name: 'Olivia Cottage',
    price: 32000,
    guests: 8,
    images: [
      { src: 'https://placehold.co/800x600.png', hint: 'large family cottage' },
      { src: 'https://placehold.co/800x600.png', hint: 'spacious living room' },
      { src: 'https://placehold.co/800x600.png', hint: 'cottage exterior garden' },
    ],
    description: 'Ideal for large families or groups, Olivia Cottage accommodates up to 8 guests, offering ample space and comfort for a memorable group getaway.',
    amenities: ['4 Bedrooms', 'Wi-Fi', 'Fully Equipped Kitchen', 'Spacious Deck', '24-hour Security'],
  },
  {
    name: 'Double Alma Cottage',
    price: 32000,
    guests: 8,
    images: [
      { src: 'https://placehold.co/800x600.png', hint: 'modern group cabin' },
      { src: 'https://placehold.co/800x600.png', hint: 'cottage dining area' },
      { src: 'https://placehold.co/800x600.png', hint: 'view from cottage window' },
    ],
    description: 'Catering to large families or groups, Double Alma Cottage sleeps 8 guests and provides a comfortable and communal atmosphere for your retreat.',
    amenities: ['4 Bedrooms', 'Wi-Fi', 'Fully Equipped Kitchen', 'Spacious Deck', '24-hour Security'],
  },
  {
    name: 'Alma 2 (The Treehouse)',
    price: 35000,
    guests: 8,
    images: [
      { src: 'https://placehold.co/800x600.png', hint: 'treetop treehouse forest' },
      { src: 'https://placehold.co/800x600.png', hint: 'treehouse interior wood' },
      { src: 'https://placehold.co/800x600.png', hint: 'bridge to treehouse' },
    ],
    description: 'This unique treetop stay accommodates up to 8 guests and is tailored for those seeking an adventurous and memorable lodging experience among the branches.',
    amenities: ['4 Bedrooms', 'Wi-Fi', 'Fully Equipped Kitchen', 'Spacious Deck', '24-hour Security'],
  },
];

const amenityIcons: { [key: string]: React.ReactNode } = {
    'Wi-Fi': <Wifi className="h-4 w-4" />,
    'Guests': <Users className="h-4 w-4" />,
    'Fully Equipped Kitchen': <Utensils className="h-4 w-4" />,
    'Spacious Deck': <Trees className="h-4 w-4" />,
    '24-hour Security': <ShieldCheck className="h-4 w-4" />,
}

export default function AccommodationsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center">
        <h1 className={cn('text-4xl md:text-5xl font-bold font-headline text-primary')}>Our Accommodations</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-foreground/80">
          Find your private haven in nature. Each of our four distinct cottages is designed to offer a unique and comfortable experience, blending seamlessly with the natural surroundings.
        </p>
      </div>
      <Separator className="my-12" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {accommodations.map((item) => (
          <Card key={item.name} className="overflow-hidden flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300 group">
            <CardHeader className="p-0">
               <Carousel className="w-full">
                <CarouselContent>
                  {item.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative h-64 w-full">
                        <Image
                          src={image.src}
                          alt={`${item.name} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                          data-ai-hint={image.hint}
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
              <p className="text-lg font-semibold text-primary mt-1">Ksh {item.price.toLocaleString()} / night</p>
              <CardDescription className="mt-4 text-base">{item.description}</CardDescription>
               <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Up to {item.guests} guests</span>
                </div>
                {item.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center gap-2 text-sm text-muted-foreground">
                        {amenityIcons[amenity] || null}
                        <span>{amenity}</span>
                    </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-6 bg-muted/50">
              <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/booking">Book Now</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
