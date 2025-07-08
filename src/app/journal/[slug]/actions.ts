'use server';

import { incrementPostLikes } from '@/services/postService';
import { revalidatePath } from 'next/cache';

export async function likePost(postId: string, slug: string) {
  try {
    await incrementPostLikes(postId);
    revalidatePath(`/journal/${slug}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to like post:', error);
    return { error: 'Failed to like post.' };
  }
}
