
import { getCottages } from '@/services/contentService';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { RetreatView } from './components/retreat-view';
import { Suspense } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';


function CottagesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="overflow-hidden flex flex-col shadow-lg group">
           <CardHeader className="p-0">
             <Skeleton className="h-64 w-full" />
           </CardHeader>
           <CardContent className="p-6 flex-grow">
             <Skeleton className="h-6 w-1/2 mb-2" />
             <Skeleton className="h-5 w-1/3 mb-4" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-5/6 mt-2" />
             <Skeleton className="h-4 w-3/4 mt-2" />
           </CardContent>
           <CardFooter className="p-6 bg-muted/50">
             <Skeleton className="h-10 w-full" />
           </CardFooter>
        </Card>
      ))}
    </div>
  )
}


async function CottagesData() {
  const cottages = await getCottages();
  return <RetreatView cottages={cottages} />;
}

export default function TheRetreatPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 scroll-mt-20">
      <div className="text-center">
        <h1 className={cn('text-4xl md:text-5xl font-bold font-headline text-primary')}>The Suites & Cottages</h1>
        <p className="mt-4 text-lg max-w-3xl mx-auto text-foreground/80 font-body">
          Find your private haven in nature. The love of nature and the outdoors inspired the design of our distinct cottages, each uniquely placed to appreciate the surrounding environment.
        </p>
      </div>

      <Separator className="my-12" />
      
      <Suspense fallback={<CottagesSkeleton />}>
        <CottagesData />
      </Suspense>
    </div>
  );
}
