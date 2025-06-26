import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

const blogPosts = [
  {
    title: 'A Family Adventure: Water Slides and Boat Rides at the Retreat',
    excerpt: 'Looking for family fun? Discover the joy of our water slides and peaceful boat rides, perfect for creating lasting memories.',
    image: 'https://placehold.co/800x600.png',
    hint: 'family water slide',
    date: 'October 26, 2023',
    slug: 'family-adventure-water-fun',
  },
  {
    title: "Top 5 Hiking Trails in the Tigoni Area",
    excerpt: 'The Tigoni region is a hiker\'s paradise. We\'ve compiled a list of our top 5 trails, from leisurely strolls to challenging ascents, each offering breathtaking views.',
    image: 'https://placehold.co/800x600.png',
    hint: 'hiking trail tea fields',
    date: 'October 15, 2023',
    slug: 'top-hiking-trails-tigoni',
  },
  {
    title: 'A Guide to Self-Catering in Tigoni\'s Paradise',
    excerpt: 'Embrace the "home away from home" experience. Our guide to self-catering, from local markets to meal ideas for your fully equipped kitchen.',
    image: 'https://placehold.co/800x600.png',
    hint: 'fresh vegetables market',
    date: 'September 28, 2023',
    slug: 'self-catering-guide',
  },
   {
    title: 'Discovering Tigoni\'s Hidden Gems: Waterfalls and More',
    excerpt: 'Venture beyond the retreat to find the stunning natural beauty of the surrounding area, including picturesque hidden waterfalls.',
    image: 'https://placehold.co/800x600.png',
    hint: 'hidden waterfall jungle',
    date: 'September 10, 2023',
    slug: 'tigoni-hidden-gems',
  },
  {
    title: 'Digital Detox: How to Unplug and Reconnect',
    excerpt: 'In a world of constant connectivity, learn the benefits of a digital detox and find practical tips for unplugging during your stay with us.',
    image: 'https://placehold.co/800x600.png',
    hint: 'person relaxing hammock',
    date: 'August 22, 2023',
    slug: 'digital-detox',
  },
   {
    title: 'Exploring Coomete Farm: A Bird Watcher\'s Guide',
    excerpt: 'Discover the vibrant ecosystem on Coomete Farm. Learn about the diverse bird species you can spot while walking through the serene landscape.',
    image: 'https://placehold.co/800x600.png',
    hint: 'exotic bird branch',
    date: 'August 5, 2023',
    slug: 'coomete-farm-bird-watching',
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center">
        <h1 className={cn('text-4xl md:text-5xl font-bold font-headline text-primary')}>From Our Journal</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-foreground/80">
          Stories, tips, and inspiration from the heart of nature. Dive into our latest articles and discover more about the Green&apos;s Green Retreat experience.
        </p>
      </div>
      <Separator className="my-12" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Card key={post.title} className="overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="p-0">
              <Link href={`/blog/${post.slug}`} className="block relative h-64 w-full">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  data-ai-hint={post.hint}
                />
              </Link>
            </CardHeader>
            <CardContent className="p-6 flex-grow">
              <p className="text-sm text-muted-foreground">{post.date}</p>
              <CardTitle className={cn("font-headline text-2xl mt-2")}>
                <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">{post.title}</Link>
              </CardTitle>
              <CardDescription className="mt-4 text-base">{post.excerpt}</CardDescription>
            </CardContent>
            <CardFooter className="p-6 bg-muted/50">
              <Button asChild variant="secondary" className="w-full">
                <Link href={`/blog/${post.slug}`}>Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
