
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowRight, Bird, Fish, Sailboat, Waves } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const accommodations = [
  {
    name: 'Alma 1 Cottage',
    description: 'A cozy hideaway for 2, perched in the valley with stunning views.',
    image: 'https://placehold.co/600x400.png',
    hint: 'cozy cottage valley',
  },
  {
    name: 'Olivia Cottage',
    description: 'Ideal for large families or groups, accommodating up to 8 guests.',
    image: 'https://placehold.co/600x400.png',
    hint: 'large family cottage',
  },
  {
    name: 'Alma 2 (The Treehouse)',
    description: 'A unique treetop stay for an adventurous and memorable experience.',
    image: 'https://placehold.co/600x400.png',
    hint: 'treetop treehouse forest',
  },
];

const activities = [
  {
    name: 'Water Slides',
    description: 'Fun for the whole family on our exciting water slides.',
    icon: <Waves className="w-10 h-10 text-primary" />,
  },
  {
    name: 'Boat Rides',
    description: 'Enjoy a peaceful boat ride on the serene waters.',
    icon: <Sailboat className="w-10 h-10 text-primary" />,
  },
  {
    name: 'Fishing',
    description: 'Cast a line and relax while fishing in our well-stocked waters.',
    icon: <Fish className="w-10 h-10 text-primary" />,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative h-[80vh] min-h-[500px] w-full flex items-center justify-center text-center text-white overflow-hidden">
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
            Green&apos;s Green Retreat
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
            Escape to tranquility. Your boutique nature adventure awaits.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/booking">Book Your Stay</Link>
          </Button>
        </div>
      </section>

      <section id="about" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className={cn('text-3xl md:text-4xl font-bold font-headline text-primary')}>
              A Sanctuary in the Highlands of Tigoni
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Nestled in the highlands of Tigoni, Limuru, Green's Green Retreat is a family-owned sanctuary offering a tranquil escape from city life. Set on Coomete Farm, a property with over 76 years of agricultural heritage, we provide a deep connection with nature.
            </p>
            <p className="mt-4 text-lg text-foreground/80">
              Despite our serene setting amidst lush tea fields, we are conveniently located just a 30-45 minute drive from Nairobi. We promise tranquility, privacy, and a chance to unwind and reconnect, waking up to birdsong and enjoying uninterrupted views.
            </p>
          </div>
          <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl">
             <Image
                src="https://placehold.co/600x400.png"
                alt="A tranquil path through a sun-dappled forest"
                fill
                className="object-cover"
                data-ai-hint="tea fields Tigoni"
              />
          </div>
        </div>
      </section>

      <section id="accommodations" className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className={cn('text-3xl md:text-4xl font-bold font-headline text-primary')}>Our Accommodations</h2>
            <p className="mt-2 text-lg max-w-2xl mx-auto text-foreground/80">
              Comfort and nature in perfect harmony.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accommodations.map((item) => (
              <Card key={item.name} className="overflow-hidden flex flex-col">
                <CardHeader className="p-0">
                  <div className="relative h-60 w-full">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      data-ai-hint={item.hint}
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-6 flex-grow">
                   <CardTitle className={cn("font-headline text-2xl")}>{item.name}</CardTitle>
                  <CardDescription className="mt-2 text-base">{item.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant="secondary">
                     <Link href="/accommodations">Learn More</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

       <section id="activities" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className={cn('text-3xl md:text-4xl font-bold font-headline text-primary')}>Unforgettable Activities</h2>
          <p className="mt-2 text-lg max-w-2xl mx-auto text-foreground/80">
            Adventure and relaxation tailored for you.
          </p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {activities.map((activity) => (
              <Card key={activity.name}>
                <CardHeader className="flex flex-row items-center gap-4">
                  {activity.icon}
                  <CardTitle className={cn("font-headline text-2xl m-0")}>{activity.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">{activity.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
            <Button asChild size="lg" className="mt-12" variant="outline">
                <Link href="/activities">
                Explore All Activities
                <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
