
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { getActivities } from '@/services/contentService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default async function ExperiencesPage() {
  const activities = await getActivities();

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
        {activities.length === 0 ? (
             <Alert variant="destructive" className="sm:col-span-2 lg:col-span-3">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Activities</AlertTitle>
                <AlertDescription>
                    We couldn't load the activities information at this time. The connection to the database may have failed. Please check the server logs for more details.
                </AlertDescription>
            </Alert>
        ) : (
            activities.map((activity) => {
                const imageUrlSource = (activity as any).imageUrl || (activity as any)['imageUrl '];
                let displayUrl = 'https://placehold.co/800x600.png';

                if (typeof imageUrlSource === 'string' && imageUrlSource.trim()) {
                    displayUrl = imageUrlSource;
                } else if (Array.isArray(imageUrlSource)) {
                    const firstValidUrl = imageUrlSource.find(url => typeof url === 'string' && url.trim() !== '');
                    if (firstValidUrl) {
                        displayUrl = firstValidUrl;
                    }
                }
                
                return (
                    <Card key={activity.id} className="overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="p-0">
                            <div className="relative h-64 w-full">
                            <Image
                                src={displayUrl}
                                alt={activity.name}
                                fill
                                className="object-cover"
                                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                                data-ai-hint={activity.imageHint || 'nature activity'}
                            />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 flex-grow flex flex-col">
                            <CardTitle className={cn("font-headline text-2xl")}>{activity.name}</CardTitle>
                            <p className="text-foreground/70 mt-2 flex-grow font-body">{activity.description}</p>
                        </CardContent>
                    </Card>
                );
            })
        )}
      </div>
    </div>
  );
}
