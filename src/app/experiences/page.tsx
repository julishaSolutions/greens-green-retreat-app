
'use client';

import type { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Sailboat, Bird, Fish, Tent, Waves, Tractor, Sparkles } from 'lucide-react';

type Activity = {
  id: string;
  name: string;
  description: string;
  icon: string; // Should match a key in iconMap
};

const iconMap: { [key: string]: LucideIcon } = {
  'Waves': Waves,
  'Sailboat': Sailboat,
  'Fish': Fish,
  'Tent': Tent,
  'Bird': Bird,
  'Tractor': Tractor,
  'Sparkles': Sparkles
};


export default function ExperiencesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'activities'), (snapshot) => {
      const activitiesData: Activity[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Activity));
      setActivities(activitiesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
        {loading ? (
             Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="text-center shadow-lg flex flex-col">
                    <CardHeader className="flex-grow-0">
                        <Skeleton className="mx-auto rounded-full h-24 w-24" />
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col">
                        <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-5/6 mx-auto" />
                    </CardContent>
                </Card>
             ))
        ) : (
            activities.map((activity) => {
                const IconComponent = iconMap[activity.icon];
                return (
                    <Card key={activity.id} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                        <CardHeader className="flex-grow-0">
                        <div className="mx-auto bg-primary/10 rounded-full h-24 w-24 flex items-center justify-center">
                            {IconComponent ? <IconComponent className="w-12 h-12 text-primary" /> : null}
                        </div>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col">
                        <CardTitle className={cn("font-headline text-2xl")}>{activity.name}</CardTitle>
                        <p className="text-foreground/70 mt-2 flex-grow font-body">{activity.description}</p>

                        </CardContent>
                    </Card>
                )
            })
        )}
      </div>
    </div>
  );
}
