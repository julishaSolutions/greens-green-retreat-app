'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Sailboat, Bird, Fish, Tent, Waves, Tractor } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, DocumentData } from 'firebase/firestore';

type Activity = {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
};

const iconMap: { [key: string]: ReactNode } = {
  'water-slides': <Waves className="w-12 h-12 text-primary" />,
  'boat-rides': <Sailboat className="w-12 h-12 text-primary" />,
  'fishing': <Fish className="w-12 h-12 text-primary" />,
  'camping': <Tent className="w-12 h-12 text-primary" />,
  'bird-watching': <Bird className="w-12 h-12 text-primary" />,
  'farm-tours': <Tractor className="w-12 h-12 text-primary" />,
};

export default function ExperiencesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'activities'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const activitiesData: Activity[] = [];
      querySnapshot.forEach((doc: DocumentData) => {
        const data = doc.data();
        activitiesData.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          icon: iconMap[data.iconName] || <Tractor className="w-12 h-12 text-primary" />, // Default icon
        });
      });
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
                        <Skeleton className="h-7 w-3/4 mx-auto" />
                        <Skeleton className="h-16 w-full mt-4" />
                    </CardContent>
                </Card>
            ))
        ) : (
            activities.map((activity) => (
                <Card key={activity.id} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
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
            ))
        )}
      </div>
    </div>
  );
}
