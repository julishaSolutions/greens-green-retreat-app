import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Wifi, BedDouble, Trees, Utensils } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const accommodations = [
  {
    name: 'Forest Haven Cabin',
    price: 180,
    images: [
      { src: 'https://placehold.co/800x600.png', hint: 'forest cabin sunset' },
      { src: 'https://placehold.co/800x600.png', hint: 'cozy cabin interior' },
      { src: 'https://placehold.co/800x600.png', hint: 'forest path' },
    ],
    description: 'Immerse yourself in the tranquility of the forest. This cozy cabin is perfect for a romantic escape, featuring a private deck and a wood-burning stove.',
    amenities: ['1 Bedroom', 'Wi-Fi', 'Kitchenette', 'Private Deck'],
  },
  {
    name: 'Lakeside Serenity Villa',
    price: 250,
    images: [
      { src: 'https://placehold.co/800x600.png', hint: 'luxury villa lake' },
      { src: 'https://placehold.co/800x600.png', hint: 'villa living room' },
      { src: 'https://placehold.co/800x600.png', hint: 'lake view balcony' },
    ],
    description: 'Wake up to stunning lake views in this elegant villa. With spacious living areas and modern amenities, it\'s ideal for those seeking luxury in nature.',
    amenities: ['2 Bedrooms', 'Wi-Fi', 'Full Kitchen', 'Lake View'],
  },
  {
    name: 'Mountain View Lodge',
    price: 320,
    images: [
      { src: 'https://placehold.co/800x600.png', hint: 'mountain lodge snow' },
      { src: 'https://placehold.co/800x600.png', hint: 'lodge fireplace' },
      { src: 'https://placehold.co/800x600.png', hint: 'mountain view window' },
    ],
    description: 'Perfect for families or groups, this lodge offers breathtaking mountain views and ample space. Enjoy evenings by the grand fireplace.',
    amenities: ['4 Bedrooms', 'Wi-Fi', 'Gourmet Kitchen', 'Fireplace'],
  },
  {
    name: 'Meadow Glade Yurt',
    price: 150,
    images: [
      { src: 'https://placehold.co/800x600.png', hint: 'yurt meadow night' },
      { src: 'https://placehold.co/800x600.png', hint: 'yurt interior cozy' },
      { src: 'https://placehold.co/800x600.png', hint: 'stargazing from yurt' },
    ],
    description: 'Experience nature up-close in our luxurious yurt. A unique and comfortable way to enjoy the great outdoors without sacrificing comfort.',
    amenities: ['Studio', 'Wi-Fi', 'Shared Kitchen', 'Stargazing Roof'],
  },
  {
    name: 'Canopy Treehouse',
    price: 280,
    images: [
      { src: 'https://placehold.co/800x600.png', hint: 'treehouse canopy forest' },
      { src: 'https://placehold.co/800x600.png', hint: 'treehouse interior view' },
      { src: 'https://placehold.co/800x600.png', hint: 'suspended bridge forest' },
    ],
    description: 'Live out your childhood dreams in our enchanting treehouse. Perched among the trees, it offers a unique perspective on the forest.',
    amenities: ['1 Bedroom', 'Wi-Fi', 'Kitchenette', 'Suspended Bridge'],
  },
  {
    name: 'Riverbank Cottage',
    price: 210,
    images: [
      { src: 'https://placehold.co/800x600.png', hint: 'cottage riverbank morning' },
      { src: 'https://placehold.co/800x600.png', hint: 'river view from cottage' },
      { src: 'https://placehold.co/800x600.png', hint: 'cozy cottage kitchen' },
    ],
    description: 'A charming cottage situated by a gentle river. The soothing sounds of water provide a peaceful soundtrack to your stay.',
    amenities: ['2 Bedrooms', 'Wi-Fi', 'Full Kitchen', 'River Access'],
  },
];

const amenityIcons = {
    'Wi-Fi': <Wifi className="h-4 w-4" />,
    'default': <BedDouble className="h-4 w-4" />,
    'Kitchenette': <Utensils className="h-4 w-4" />,
    'Full Kitchen': <Utensils className="h-4 w-4" />,
    'Gourmet Kitchen': <Utensils className="h-4 w-4" />,
    'Private Deck': <Trees className="h-4 w-4" />
}

export default function AccommodationsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center">
        <h1 className={cn('text-4xl md:text-5xl font-bold font-headline text-primary')}>Our Accommodations</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-foreground/80">
          Find your perfect sanctuary. Each of our accommodations is designed to offer a unique and comfortable experience, blending seamlessly with the natural surroundings.
        </p>
      </div>
      <Separator className="my-12" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <p className="text-lg font-semibold text-primary mt-1">${item.price} / night</p>
              <CardDescription className="mt-4 text-base">{item.description}</CardDescription>
               <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {item.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center gap-2 text-sm text-muted-foreground">
                        {amenity.includes('Bedroom') ? amenityIcons['default'] : (amenityIcons[amenity as keyof typeof amenityIcons] || amenityIcons['default'])}
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
