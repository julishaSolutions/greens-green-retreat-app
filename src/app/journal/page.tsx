import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export const journalPosts = [
  {
    title: 'A Family Adventure: Water Slides and Boat Rides at the Retreat',
    excerpt: 'Looking for family fun? Discover the joy of our water slides and peaceful boat rides, perfect for creating lasting memories.',
    image: 'https://placehold.co/800x600.png',
    hint: 'family water slide',
    date: 'October 26, 2023',
    slug: 'family-adventure-water-fun',
    content: `At Green's Green Retreat, we believe that the best memories are made together. That's why we've designed a range of activities perfect for families looking to splash, laugh, and explore. Our water slides are a highlight for guests of all ages, providing a thrilling way to cool off on a sunny afternoon. The joyous shrieks and laughter echoing from the slides are the sounds of pure, unadulterated fun.

For those seeking a more tranquil experience, our boat rides offer a serene journey across the calm waters of our dam. Glide peacefully along, taking in the lush scenery and the gentle sounds of nature. It's a perfect opportunity for quiet conversation, for pointing out different birds to your children, or simply for enjoying a moment of shared peace. These moments on the water are often the ones families treasure most—a simple, beautiful way to connect with each other and the stunning environment around you.`
  },
  {
    title: "Top 5 Hiking Trails in the Tigoni Area",
    excerpt: 'The Tigoni region is a hiker\'s paradise. We\'ve compiled a list of our top 5 trails, from leisurely strolls to challenging ascents, each offering breathtaking views.',
    image: 'https://placehold.co/800x600.png',
    hint: 'hiking trail tea fields',
    date: 'October 15, 2023',
    slug: 'top-hiking-trails-tigoni',
    content: `The rolling hills and verdant landscapes of Tigoni are a siren call to all who love to walk, hike, and explore. Just a stone's throw from Green's Green Retreat, a network of trails awaits, offering something for every level of fitness and ambition. For a gentle introduction, we recommend the path that meanders through the neighboring tea plantations. It's a relatively flat, two-hour walk that offers stunning panoramic views and a fascinating glimpse into the region's most famous industry.

For the more adventurous, the trail leading to the nearby waterfall is a must-do. This challenging three-hour hike rewards your efforts with the spectacular sight and sound of cascading water, a perfect spot for a well-deserved rest and a picnic. Remember to wear sturdy shoes, pack plenty of water, and don't forget your camera—the views are truly unforgettable.`
  },
  {
    title: 'A Guide to Self-Catering in Tigoni\'s Paradise',
    excerpt: 'Embrace the "home away from home" experience. Our guide to self-catering, from local markets to meal ideas for your fully equipped kitchen.',
    image: 'https://placehold.co/800x600.png',
    hint: 'fresh vegetables market',
    date: 'September 28, 2023',
    slug: 'self-catering-guide',
    content: `One of the unique joys of staying at Green's Green Retreat is the freedom of self-catering. Each of our cottages features a fully-equipped kitchen, inviting you to create your own culinary masterpieces with the fresh, vibrant produce of the Tigoni region. We encourage you to visit the local farmers' markets, where you can find everything from crisp vegetables and sweet fruits to fresh-from-the-farm eggs and dairy.

Back in your cottage, the well-appointed kitchen is your canvas. Imagine preparing a hearty breakfast with eggs gathered that morning, or a delicious dinner using ingredients you've selected yourself. It's a wonderful way to feel truly at home, to cook and eat on your own schedule, and to share intimate meals with your loved ones on your private deck, surrounded by the sights and sounds of nature.`
  },
   {
    title: 'Discovering Tigoni\'s Hidden Gems: Waterfalls and More',
    excerpt: 'Venture beyond the retreat to find the stunning natural beauty of the surrounding area, including picturesque hidden waterfalls.',
    image: 'https://placehold.co/800x600.png',
    hint: 'hidden waterfall jungle',
    date: 'September 10, 2023',
    slug: 'tigoni-hidden-gems',
    content: `While Green's Green Retreat is a destination in itself, the surrounding Tigoni area is rich with natural treasures waiting to be discovered. We encourage our guests to step out and explore the local landscape. A short drive or a vigorous hike can lead you to stunning hidden waterfalls, where you can feel the cool mist on your face and marvel at the power of nature.

Beyond the waterfalls, you'll find winding country lanes perfect for a leisurely drive, scenic picnic spots with breathtaking views, and charming local villages where you can experience the warm hospitality of the community. Exploring these hidden gems provides a deeper connection to the region and a richer, more authentic travel experience. Ask our staff for a map and recommendations—we're always happy to share our favorite local spots.`
  },
  {
    title: 'Digital Detox: How to Unplug and Reconnect',
    excerpt: 'In a world of constant connectivity, learn the benefits of a digital detox and find practical tips for unplugging during your stay with us.',
    image: 'https://placehold.co/800x600.png',
    hint: 'person relaxing hammock',
    date: 'August 22, 2023',
    slug: 'digital-detox',
    content: `In our always-on world, the pressure to be constantly connected can be overwhelming. Green's Green Retreat offers the perfect environment to disconnect from your devices and reconnect with yourself, your loved ones, and the natural world. A digital detox, even for a short time, can reduce stress, improve sleep, and enhance your ability to be present in the moment.

We encourage you to embrace the opportunity. Leave your phone in the cottage for an afternoon and take a walk. Sit on your deck and listen to the birdsong instead of scrolling through social media. Read a book, have a long conversation, or simply sit in silence and watch the clouds drift by. You might be surprised at how refreshing it feels to unplug. The world can wait. Your peace of mind is right here.`
  },
   {
    title: 'Exploring Coomete Farm: A Bird Watcher\'s Guide',
    excerpt: 'Discover the vibrant ecosystem on Coomete Farm. Learn about the diverse bird species you can spot while walking through the serene landscape.',
    image: 'https://placehold.co/800x600.png',
    hint: 'exotic bird branch',
    date: 'August 5, 2023',
    slug: 'coomete-farm-bird-watching',
    content: `Our retreat is nestled on Coomete Farm, a place with a rich agricultural history and an even richer ecosystem. For bird watchers, it's a paradise. The combination of open fields, wooded areas, and water sources attracts a stunning variety of bird species, making every walk an opportunity for discovery.

Grab your binoculars and a field guide, and set out on an early morning stroll. You're likely to spot everything from the brilliantly colored sunbirds darting among the flowers to majestic eagles soaring overhead. Listen for the distinctive calls of hornbills and the cheerful chirping of weavers. Whether you're a seasoned ornithologist or a curious beginner, the bird life at Coomete Farm offers a captivating connection to the wild heart of Tigoni.`
  },
];

export default function JournalPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center">
        <h1 className={cn('text-4xl md:text-5xl font-bold font-headline text-primary')}>From Our Journal</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-foreground/80 font-sans">
          Stories, tips, and inspiration from the heart of nature. Dive into our latest articles and discover more about the Green's Green Retreat experience.
        </p>
      </div>
      <Separator className="my-12" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {journalPosts.map((post) => (
          <Card key={post.title} className="overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="p-0">
              <Link href={`/journal/${post.slug}`} className="block relative h-64 w-full">
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
              <p className="text-sm text-muted-foreground font-sans">{post.date}</p>
              <CardTitle className={cn("font-headline text-2xl mt-2")}>
                <Link href={`/journal/${post.slug}`} className="hover:text-primary transition-colors">{post.title}</Link>
              </CardTitle>
              <CardDescription className="mt-4 text-base">{post.excerpt}</CardDescription>
            </CardContent>
            <CardFooter className="p-6 bg-muted/50">
              <Button asChild variant="secondary" className="w-full">
                <Link href={`/journal/${post.slug}`}>Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
