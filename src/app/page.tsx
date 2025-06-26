
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowRight, BedDouble, Bike, MountainSnow, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const accommodations = [
  {
    name: 'Forest Cabin',
    description: 'A cozy cabin nestled in the heart of the forest.',
    image: 'https://placehold.co/600x400.png',
    hint: 'forest cabin',
  },
  {
    name: 'Lakeside Villa',
    description: 'Elegant villa with stunning views of the private lake.',
    image: 'https://placehold.co/600x400.png',
    hint: 'lake villa',
  },
  {
    name: 'Mountain Lodge',
    description: 'Spacious lodge perfect for families and groups.',
    image: 'https://placehold.co/600x400.png',
    hint: 'mountain lodge',
  },
];

const activities = [
  {
    name: 'Mountain Biking',
    description: 'Explore scenic trails on two wheels.',
    icon: <Bike className="w-10 h-10 text-primary" />,
  },
  {
    name: 'Guided Hikes',
    description: 'Discover the beauty of the surrounding nature with our expert guides.',
    icon: <MountainSnow className="w-10 h-10 text-primary" />,
  },
  {
    name: 'Stargazing',
    description: 'Witness the breathtaking beauty of the night sky, far from city lights.',
    icon: <Star className="w-10 h-10 text-primary" />,
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
              Rediscover Yourself in Nature
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              Green&apos;s Green Retreat offers a unique opportunity to disconnect from the hustle and bustle of city life and reconnect with the serene beauty of the natural world. Our exclusive retreat is designed to provide you with the perfect blend of comfort, adventure, and relaxation.
            </p>
            <p className="mt-4 text-lg text-foreground/80">
              Whether you&apos;re seeking a peaceful solo journey, a romantic getaway, or a memorable family vacation, our cottages and activities are tailored to create an unforgettable experience.
            </p>
          </div>
          <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl">
             <Image
                src="https://placehold.co/600x400.png"
                alt="A tranquil path through a sun-dappled forest"
                fill
                className="object-cover"
                data-ai-hint="forest path"
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
