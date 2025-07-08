
import { getPublishedPostBySlug } from '@/services/postService';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { cn, getDisplayImageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AdPlaceholder } from '@/components/ad-placeholder';
import { SocialToolbar } from './components/social-toolbar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

export default async function JournalPostPage({ params }: { params: { slug: string } }) {
  const post = await getPublishedPostBySlug(params.slug);

  if (!post) {
    notFound();
  }
  
  const displayImageUrl = getDisplayImageUrl(post.imageUrl);

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
          <p className="mt-4 text-muted-foreground font-sans">Published on {format(post.createdAt, 'MMMM d, yyyy')}</p>
        </div>
        <div className="relative h-[50vh] max-h-[500px] w-full rounded-lg overflow-hidden shadow-xl mb-12">
          <Image
            src={displayImageUrl || 'https://placehold.co/1200x800.png'}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
            data-ai-hint="nature retreat detail"
            priority
          />
        </div>
        <article className="prose prose-lg max-w-none text-foreground/80 font-body prose-headings:font-headline prose-headings:text-primary prose-p:mb-4">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </article>
        
        <Separator className="my-8" />
        
        <SocialToolbar postId={post.id} slug={post.slug} initialLikes={post.likes || 0} postTitle={post.title} />

        <Separator className="my-8" />
        
        <div id="comments-section" className="scroll-mt-20">
          <h2 className={cn('text-3xl font-bold font-headline text-primary mb-6')}>Comments</h2>
          <Card>
            <CardContent className="p-6">
                <p className="text-muted-foreground text-center font-sans">Comments are coming soon! We'd love to hear your thoughts.</p>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <AdPlaceholder />

      </div>
    </div>
  );
}
