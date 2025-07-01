import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Sailboat, Bird, Fish, Mountain, Tent, Waves, Ship, Grape, Droplets } from 'lucide-react';
import type { ReactNode } from 'react';

type Experience = {
  name: string;
  description: string;
  icon: ReactNode;
};

const experiences: Experience[] = [
  {
    name: 'Water Slides',
    description: 'Enjoy a splash of fun with our exciting water slides, perfect for guests of all ages to cool off and have a great time.',
    icon: <Waves className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Boat Rides',
    description: 'Take a peaceful boat ride on the calm waters, a perfect way to relax and soak in the serene natural beauty of the retreat.',
    icon: <Sailboat className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Fishing',
    description: 'Cast a line and unwind by the water. Our fishing spots are ideal for both seasoned anglers and beginners.',
    icon: <Fish className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Camping',
    description: 'Experience a night under the stars. Our designated camping areas provide an authentic connection with nature.',
    icon: <Tent className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Bird Watching',
    description: 'Our retreat is a haven for a diverse range of bird species. Grab your binoculars for a delightful bird watching session.',
    icon: <Bird className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Hiking',
    description: 'Explore the scenic beauty of the Tigoni region through its numerous hiking trails, suitable for all fitness levels.',
    icon: <Mountain className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Kayaking',
    description: 'Paddle through the tranquil waters and discover hidden corners of our beautiful landscape by kayak.',
    icon: <Ship className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Picnics',
    description: 'Enjoy a delightful picnic amidst the lush greenery. A perfect way to spend quality time with loved ones.',
    icon: <Grape className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Waterfall Discovery',
    description: 'Embark on an adventure to discover the nearby waterfalls, a refreshing and picturesque experience.',
    icon: <Droplets className="w-12 h-12 text-primary" />,
  },
];


export default function ExperiencesPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center">
        <h1 className={cn('text-4xl md:text-5xl font-bold font-headline text-primary')}>Experiences & Journeys</h1>
        <p className="mt-4 text-lg max-w-3xl mx-auto text-foreground/80 font-sans">
          From tranquil relaxation to thrilling adventures, Green's Green Retreat offers something for everyone. We offer a selection of on-site activities and local journeys that focus on wellness, family-friendly enjoyment, and a deep appreciation of the natural surroundings.
        </p>
      </div>
      <Separator className="my-12" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
        {experiences.map((activity) => (
          <Card key={activity.name} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <CardHeader className="flex-grow-0">
              <div className="mx-auto bg-primary/10 rounded-full h-24 w-24 flex items-center justify-center">
                {activity.icon}
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <CardTitle className={cn("font-headline text-2xl")}>{activity.name}</CardTitle>
              <p className="text-foreground/70 mt-2 flex-grow">{activity.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
