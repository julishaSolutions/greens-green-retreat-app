import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowRight, Trees, Leaf, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const suites = [
  {
    name: 'Valley-View Cottages',
    description: 'Intimate sanctuaries for couples or solo travelers, offering stunning, uninterrupted valley views.',
    image: 'https://placehold.co/600x400.png',
    hint: 'cozy cottage valley',
    link: '/the-retreat',
  },
  {
    name: 'Family & Group Cottages',
    description: 'Spacious and comfortable, these cottages are perfect for creating shared memories with loved ones.',
    image: 'https://placehold.co/600x400.png',
    hint: 'large family cottage',
    link: '/the-retreat',
  },
  {
    name: 'The Treetop Stay',
    description: 'A unique, adventurous experience nestled among the branches for an unforgettable escape.',
    image: 'https://placehold.co/600x400.png',
    hint: 'treetop treehouse forest',
    link: '/the-retreat',
  },
];

const experiences = [
  {
    name: 'Wellness & Spa',
    description: 'Indulge in restorative treatments that harmonize mind, body, and spirit in a tranquil setting.',
    icon: <Sparkles className="w-10 h-10 text-primary" />,
  },
  {
    name: 'Culinary Journeys',
    description: 'Experience authentic farm-to-table dining, celebrating the fresh, local flavors of Limuru.',
    icon: <Leaf className="w-10 h-10 text-primary" />,
  },
  {
    name: 'Tea Plantation Tours',
    description: 'Immerse yourself in the rich heritage of the region with a guided tour of the lush tea fields.',
    icon: <Trees className="w-10 h-10 text-primary" />,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative h-[90vh] min-h-[600px] w-full flex items-center justify-center text-center text-white overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-10"
        >
          <source src="https://res.cloudinary.com/dx6zxdlts/video/upload/v1749282824/I_promise_it_s_an_amazing_get_away_1_hm7emn.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50 -z-10" />
        <div className="container mx-auto px-4">
          <h1 className={cn('text-5xl md:text-7xl lg:text-8xl font-bold drop-shadow-lg font-headline')}>
            Breathe. Unwind. Reconnect.
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md font-body">
            Your sanctuary in the serene heart of Limuru's tea country.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground font-sans">
            <Link href="/the-retreat">Discover Your Retreat</Link>
          </Button>
        </div>
      </section>

      <section id="about" className="py-20 md:py-32 bg-card">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className={cn('text-3xl md:text-4xl font-bold font-headline text-primary')}>
              A Sanctuary of Serenity
            </h2>
            <p className="mt-4 text-lg text-foreground/80 font-body">
              Nestled in the highlands of Tigoni, Limuru, Green's Green Retreat is a family-owned sanctuary offering a tranquil escape from city life. Set on Coomete Farm, a property with over 76 years of agricultural heritage, we provide a deep connection with nature and an authentic countryside experience.
            </p>
            <p className="mt-4 text-lg text-foreground/80 font-body">
              Despite our serene setting amidst lush tea fields, we are conveniently located just a 30-45 minute drive from Nairobi. We promise tranquility, privacy, and a chance to unwind, waking up to birdsong and enjoying the uninterrupted views.
            </p>
          </div>
          <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-xl">
             <Image
                src="https://placehold.co/600x400.png"
                alt="A tranquil path through the sun-dappled tea fields of Limuru"
                fill
                className="object-cover"
                data-ai-hint="tea fields Limuru"
              />
          </div>
        </div>
      </section>

      <section id="suites" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className={cn('text-3xl md:text-4xl font-bold font-headline text-primary')}>The Suites</h2>
            <p className="mt-2 text-lg max-w-2xl mx-auto text-foreground/80 font-body">
              Restorative luxury, rooted in nature.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {suites.map((item) => (
              <Card key={item.name} className="overflow-hidden flex flex-col group">
                 <CardHeader className="p-0">
                  <div className="relative h-60 w-full overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      data-ai-hint={item.hint}
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-6 flex-grow">
                   <CardTitle className={cn("font-headline text-2xl")}>{item.name}</CardTitle>
                  <CardDescription className="mt-2 text-base font-body">{item.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full font-sans" variant="secondary">
                     <Link href={item.link}>Learn More</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

       <section id="experiences" className="py-20 md:py-32 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className={cn('text-3xl md:text-4xl font-bold font-headline text-primary')}>Signature Experiences</h2>
          <p className="mt-2 text-lg max-w-2xl mx-auto text-foreground/80 font-body">
            Curated to restore and inspire.
          </p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {experiences.map((activity) => (
              <Card key={activity.name}>
                <CardHeader className="flex flex-row items-center gap-4">
                  {activity.icon}
                  <CardTitle className={cn("font-headline text-2xl m-0")}>{activity.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 font-body">{activity.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
            <Button asChild size="lg" className="mt-12 font-sans" variant="outline">
                <Link href="/experiences">
                Explore All Experiences
                <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
