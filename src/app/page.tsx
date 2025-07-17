

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowRight, Trees, Leaf, Sparkles, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getCottages, type Cottage as Suite } from '@/services/contentService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const experiences = [
  {
    name: 'Wellness & Spa',
    description: 'Find restoration with our holistic spa treatments, inspired by traditional techniques and local botanicals.',
    icon: <Sparkles className="w-10 h-10 text-primary" />,
  },
  {
    name: 'Culinary Journeys',
    description: "Savor the taste of Limuru with our farm-to-table dining, where fresh, organic ingredients are transformed into culinary delights.",
    icon: <Leaf className="w-10 h-10 text-primary" />,
  },
  {
    name: 'Tea Plantation Tours',
    description: 'Immerse yourself in the rich heritage of Limuru’s tea culture with guided tours through the lush, serene plantations.',
    icon: <Trees className="w-10 h-10 text-primary" />,
  },
];

export default async function Home() {
  const suites = await getCottages(3);

  return (
    <div className="flex flex-col">
      <section className="relative h-[90vh] min-h-[600px] w-full flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dx6zxdlts/image/upload/v1751711841/GGR_through_the_lens_of_a_client._happyclient_%EF%B8%8F_greens_green_retreat_8_gz71bu.jpg"
          alt="A scenic view of Green's Green Retreat"
          fill
          priority
          className="object-cover -z-10"
          sizes="100vw"
          data-ai-hint="retreat scenic view"
        />
        <div className="absolute inset-0 bg-black/50 -z-10" />
        <div className="container mx-auto px-4">
          <h1 className={cn('text-5xl md:text-7xl lg:text-8xl font-bold drop-shadow-lg font-headline')}>
            Breathe. Unwind. Reconnect.
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md font-body">
            Welcome to Green’s Green Retreat! A family-owned sanctuary that promises tranquility and privacy.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground font-sans">
            <Link href="/the-retreat">Discover Your Retreat</Link>
          </Button>
        </div>
      </section>

      <section id="about" className="py-20 md:py-32 bg-background">
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
                src="https://res.cloudinary.com/dx6zxdlts/image/upload/v1751714095/Beautiful_afternoon_by_the_dam_nothing_beats_it_..._outdoorlife_outdoorliving_outdoor_hgsrny.jpg"
                alt="A serene view of the dam at Green's Green Retreat"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
                data-ai-hint="dam retreat"
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
            {!suites || suites.length === 0 ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="overflow-hidden flex flex-col group">
                  <CardHeader className="p-0">
                    <Skeleton className="h-60 w-full" />
                  </CardHeader>
                  <CardContent className="pt-6 flex-grow">
                    <Skeleton className="h-6 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6 mt-2" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))
            ) : (
              suites.map((item) => {
                const firstValidImage = Array.isArray(item.imageUrls)
                  ? item.imageUrls.find(url => typeof url === 'string' && url.trim() !== '')
                  : undefined;

                return (
                  <Card key={item.id} className="overflow-hidden flex flex-col group">
                    <CardHeader className="p-0">
                      <div className="relative h-60 w-full overflow-hidden">
                        <Image
                          src={firstValidImage || 'https://placehold.co/600x400.png'}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          data-ai-hint="luxury cottage exterior"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 flex-grow">
                      <CardTitle className={cn("font-headline text-2xl")}>{item.name}</CardTitle>
                      <CardDescription className="mt-2 text-base font-body">{item.description}</CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-sans">
                        <Link href={item.slug ? `/cottages/${item.slug}` : `/the-retreat#${item.id}`}>Learn More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            )}
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
