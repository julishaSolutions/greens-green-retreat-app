import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Bike, Bird, Fish, MountainSnow, Star, Sun, Telescope, Trees, Waves, Zap } from 'lucide-react';
import type { ReactNode } from 'react';

type Activity = {
  name: string;
  description: string;
  icon: ReactNode;
};

const activities: Activity[] = [
  {
    name: 'Guided Hikes',
    description: 'Explore the stunning landscapes and hidden gems of our retreat with an experienced guide. Trails for all skill levels available.',
    icon: <MountainSnow className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Mountain Biking',
    description: 'Get your adrenaline pumping on our challenging and scenic mountain biking trails. Bike rentals available on-site.',
    icon: <Bike className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Kayaking & Canoeing',
    description: 'Paddle across our serene private lake. A peaceful way to connect with the water and enjoy the views.',
    icon: <Waves className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Stargazing Nights',
    description: 'Far from city lights, our retreat offers a spectacular view of the cosmos. Join our guided stargazing sessions.',
    icon: <Telescope className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Bird Watching',
    description: 'Our diverse ecosystem is home to a wide variety of bird species. A perfect activity for nature lovers and photographers.',
    icon: <Bird className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Forest Bathing (Shinrin-yoku)',
    description: 'Immerse yourself in the atmosphere of the forest for a meditative and rejuvenating experience.',
    icon: <Trees className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Yoga & Meditation',
    description: 'Join our daily yoga and meditation classes in our open-air studio, surrounded by the sounds of nature.',
    icon: <Zap className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Fishing',
    description: 'Cast a line in our well-stocked lake. A relaxing pastime for both novice and experienced anglers.',
    icon: <Fish className="w-12 h-12 text-primary" />,
  },
];


export default function ActivitiesPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center">
        <h1 className={cn('text-4xl md:text-5xl font-bold font-headline text-primary')}>Activities & Experiences</h1>
        <p className="mt-4 text-lg max-w-3xl mx-auto text-foreground/80">
          From tranquil relaxation to thrilling adventures, Verdant Getaways offers something for everyone. Embrace the opportunity to create lasting memories.
        </p>
      </div>
      <Separator className="my-12" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {activities.map((activity) => (
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
