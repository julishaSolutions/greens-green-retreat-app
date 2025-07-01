import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Sailboat, Bird, Fish, Tent, Waves, Tractor } from 'lucide-react';
import type { ReactNode } from 'react';

type Experience = {
  name: string;
  description: string;
  icon: ReactNode;
};

const experiences: Experience[] = [
  {
    name: 'Water Slides',
    description: 'Enjoy a splash of fun with our exciting, custom-made water slides, perfect for guests of all ages to cool off and have a great time.',
    icon: <Waves className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Boat Rides',
    description: 'Take a peaceful boat ride on the calm waters, a perfect way to relax and soak in the serene natural beauty of the retreat.',
    icon: <Sailboat className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Fishing',
    description: 'Cast a line and unwind by the water. Our fishing spots are ideal for both seasoned anglers and beginners. Please bring your own gear.',
    icon: <Fish className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Camping',
    description: 'Experience a night under the stars. Our designated camping areas provide an authentic connection with nature and a space for laughter and adventure.',
    icon: <Tent className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Bird Watching',
    description: 'Our retreat is a haven for a diverse range of bird species. Grab your binoculars for a delightful bird watching session while strolling our scenic trails.',
    icon: <Bird className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Educational Farm Tours',
    description: 'Explore Coomete Farm, which has over 70 years of history. Learn about our sustainable farming practices. Tours are available at a fee.',
    icon: <Tractor className="w-12 h-12 text-primary" />,
  },
];


export default function ExperiencesPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center">
        <h1 className={cn('text-4xl md:text-5xl font-bold font-headline text-primary')}>GGR: Your Adventure, Your Pace</h1>
        <p className="mt-4 text-lg max-w-3xl mx-auto text-foreground/80 font-body">
         From thrilling water slides to relaxed bird watching, Green's Green Retreat offers a unique range of experiences for families, corporations, and individuals seeking adventure, relaxation, and bonding.
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
              <p className="text-foreground/70 mt-2 flex-grow font-body">{activity.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
