
import { getPublishedPosts } from '@/services/postService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn, getDisplayImageUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function JournalPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center">
        <h1 className={cn('text-4xl md:text-5xl font-bold font-headline text-primary')}>From Our Journal</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-foreground/80 font-sans">
          Stories, tips, and inspiration from the heart of nature. Dive into our latest articles and discover more about the Green's Green Retreat experience.
        </p>
      </div>
      <Separator className="my-12" />
      
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const displayImageUrl = getDisplayImageUrl(post.imageUrl);
            return (
              <Card key={post.id} className="overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0">
                  <Link href={`/journal/${post.slug}`} className="block relative h-64 w-full">
                    <Image
                      src={displayImageUrl || 'https://placehold.co/800x600.png'}
                      alt={post.title}
                      fill
                      className="object-cover"
                      data-ai-hint="nature retreat journal"
                    />
                  </Link>
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                  <p className="text-sm text-muted-foreground font-sans">{format(post.createdAt, 'MMMM d, yyyy')}</p>
                  <CardTitle className={cn("font-headline text-2xl mt-2")}>
                    <Link href={`/journal/${post.slug}`} className="hover:text-primary transition-colors">{post.title}</Link>
                  </CardTitle>
                  <CardDescription className="mt-4 text-base">{post.excerpt}</CardDescription>
                </CardContent>
                <CardFooter className="p-6 bg-muted/50">
                  <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-sans">
                    <Link href={`/journal/${post.slug}`}>Read More</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
            <h2 className="text-2xl font-headline text-primary">No posts yet...</h2>
            <p className="text-foreground/70 mt-4 font-sans">Check back soon for stories and updates from the retreat!</p>
        </div>
      )}
    </div>
  );
}
