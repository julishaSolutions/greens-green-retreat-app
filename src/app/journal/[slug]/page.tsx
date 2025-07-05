import { journalPosts } from '../page';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function JournalPostPage({ params }: { params: { slug: string } }) {
  const post = journalPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button asChild variant="outline" className="mb-8 font-sans">
            <Link href="/journal">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Journal
            </Link>
          </Button>
          <h1 className={cn('text-4xl md:text-5xl font-bold font-headline text-primary')}>{post.title}</h1>
          <p className="mt-4 text-muted-foreground font-sans">{post.date}</p>
        </div>
        <div className="relative h-[50vh] max-h-[500px] w-full rounded-lg overflow-hidden shadow-xl mb-12">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            data-ai-hint={post.hint}
            priority
          />
        </div>
        <article className="prose prose-lg max-w-none text-foreground/80 font-body prose-headings:font-headline prose-headings:text-primary prose-p:mb-4">
          {post.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>
      </div>
    </div>
  );
}
