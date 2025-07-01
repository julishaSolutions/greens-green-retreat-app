import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Wifi, Users, Trees, Utensils, ShieldCheck, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const suites = [
  {
    name: 'Alma 1 Cottage',
    price: 14000,
    guests: 2,
    images: [
      { src: 'https://placehold.co/800x600.png', hint: 'cozy cottage valley' },
      { src: 'https://placehold.co/800x600.png', hint: 'romantic cottage interior' },
      { src: 'https://placehold.co/800x600.png', hint: 'valley view deck' },
    ],
    description: 'A cozy, open-plan cottage for 1-2 people, perfect for a solo trip or a romantic getaway. It can also accommodate a young family with up to two children (ages 5 and below). It\'s perched right on top of the valley with amazing views and a private garden.',
    amenities: ['1 Bedroom', 'Wi-Fi', 'Spacious Deck', '24-hour Security'],
    whatsappLink: 'https://wa.me/p/9232092633473752/254714281791',
  },
  {
    name: 'Double Alma Cottage',
    price: 40000,
    guests: 6,
    images: [
      { src: 'https://placehold.co/800x600.png', hint: 'modern group cabin' },
      { src: 'https://placehold.co/800x600.png', hint: 'cottage dining area' },
      { src: 'https://placehold.co/800x600.png', hint: 'view from cottage window' },
    ],
    description: 'A two-bedroom, one-bathroom cottage with an outhouse, ideal for groups. The adjacent camping site promises a night full of laughter and adventure. Maximum capacity is 6 adults, but it\'s most comfortable for 4 adults and 2 kids.',
    amenities: ['2 Bedrooms', 'Wi-Fi', 'Spacious Deck', '24-hour Security'],
    whatsappLink: 'https://wa.me/p/6310381319079653/254714281791',
  },
  {
    name: 'Alma 2 (The Treehouse)',
    price: 40000,
    guests: 8,
    images: [
      { src: 'https://placehold.co/800x600.png', hint: 'treetop treehouse forest' },
      { src: 'https://placehold.co/800x600.png', hint: 'treehouse interior wood' },
      { src: 'https://placehold.co/800x600.png', hint: 'bridge to treehouse' },
    ],
    description: 'Our unique treehouse stay! Alma 2 is tall, features a downstairs bunker, and can host up to 8 guests. This adventurous lodging experience is great for game nights and making lasting memories among the branches.',
    amenities: ['Multiple Bedrooms', 'Wi-Fi', 'Spacious Deck', '24-hour Security'],
    whatsappLink: 'https://wa.me/p/7057512904270008/254714281791',
  },
];

const amenityIcons: { [key: string]: React.ReactNode } = {
    'Wi-Fi': <Wifi className="h-4 w-4" />,
    'Guests': <Users className="h-4 w-4" />,
    'Spacious Deck': <Trees className="h-4 w-4" />,
    '24-hour Security': <ShieldCheck className="h-4 w-4" />,
}

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
        {suites.map((item) => (
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
