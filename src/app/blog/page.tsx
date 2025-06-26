import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

const blogPosts = [
  {
    title: 'The Art of Forest Bathing: A Beginner\'s Guide',
    excerpt: 'Discover the Japanese practice of Shinrin-yoku and how it can profoundly impact your well-being. Learn how to get started on your next visit.',
    image: 'https://placehold.co/800x600.png',
    hint: 'person meditating forest',
    date: 'October 26, 2023',
    slug: 'forest-bathing-guide',
  },
  {
    title: "Top 5 Hiking Trails at Green's Green Retreat",
    excerpt: 'Our retreat is a hiker\'s paradise. We\'ve compiled a list of our top 5 trails, from leisurely strolls to challenging ascents, each offering breathtaking views.',
    image: 'https://placehold.co/800x600.png',
    hint: 'hiking trail mountains',
    date: 'October 15, 2023',
    slug: 'top-hiking-trails',
  },
  {
    title: 'A Culinary Journey: Farm-to-Table Dining at the Retreat',
    excerpt: 'Experience the taste of nature with our farm-to-table dining. Learn about our local sourcing, seasonal menus, and the philosophy behind our cuisine.',
    image: 'https://placehold.co/800x600.png',
    hint: 'farm-to-table dining',
    date: 'September 28, 2023',
    slug: 'farm-to-table-dining',
  },
   {
    title: 'Stargazing 101: A Guide to the Night Sky',
    excerpt: 'Escape the city glow and witness the magic of the cosmos. Our guide will help you identify constellations and celestial events visible from the retreat.',
    image: 'https://placehold.co/800x600.png',
    hint: 'night sky stars',
    date: 'September 10, 2023',
    slug: 'stargazing-guide',
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
    title: 'The Hidden World of Our Private Lake',
    excerpt: 'Discover the vibrant ecosystem living in and around our pristine lake. Learn about the flora and fauna you can spot while kayaking or walking its shores.',
    image: 'https://placehold.co/800x600.png',
    hint: 'calm lake morning',
    date: 'August 5, 2023',
    slug: 'private-lake-ecosystem',
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
