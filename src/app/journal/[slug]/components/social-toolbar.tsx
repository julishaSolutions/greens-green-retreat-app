'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { likePost } from '../actions';
import { useToast } from '@/hooks/use-toast';

type SocialToolbarProps = {
  postId: string;
  slug: string;
  initialLikes: number;
  postTitle: string;
};

export function SocialToolbar({ postId, slug, initialLikes, postTitle }: SocialToolbarProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // This check ensures localStorage is only accessed on the client side.
    if (typeof window !== 'undefined') {
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      if (likedPosts.includes(postId)) {
        setIsLiked(true);
      }
    }
  }, [postId]);

  const handleLike = async () => {
    if (isLiking || isLiked) return;
    
    setIsLiking(true);
    setIsLiked(true);
    setLikes(prev => prev + 1);

    localStorage.setItem('likedPosts', JSON.stringify([...JSON.parse(localStorage.getItem('likedPosts') || '[]'), postId]));

    const result = await likePost(postId, slug);

    if (result?.error) {
      setLikes(prev => prev - 1);
      setIsLiked(false);
      localStorage.setItem('likedPosts', JSON.stringify(JSON.parse(localStorage.getItem('likedPosts') || '[]').filter((id: string) => id !== postId)));
      toast({
        title: 'Error',
        description: 'Could not register like. Please try again.',
        variant: 'destructive',
      });
    }

    setIsLiking(false);
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: postTitle,
          text: `Check out this article from Green's Green Retreat: ${postTitle}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
        toast({
            title: 'Sharing not supported',
            description: "Your browser doesn't support the Web Share API. You can copy the URL to share.",
        });
    }
  };

  const handleCommentClick = () => {
    document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex items-center gap-4 py-4">
      <Button variant="outline" size="sm" onClick={handleLike} disabled={isLiking || isLiked} className="flex items-center gap-2 rounded-full">
        <Heart className={cn('h-5 w-5', isLiked ? 'text-destructive fill-current' : '')} />
        <span>{likes} Like{likes !== 1 ? 's' : ''}</span>
      </Button>
      <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-full" onClick={handleCommentClick}>
        <MessageCircle className="h-5 w-5" />
        <span>Comment</span>
      </Button>
      <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-full" onClick={handleShare}>
        <Share2 className="h-5 w-5" />
        <span>Share</span>
      </Button>
    </div>
  );
}
