
'use server';

import { adminDb } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

// Utility to generate a URL-friendly slug from a string
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  excerpt?: string;
  likes: number;
};

export async function createPost(postData: { title: string; content: string }): Promise<string> {
  const db = adminDb();
  const { title, content } = postData;
  const slug = slugify(title);
  const excerpt = content.substring(0, 150) + '...';

  const postRef = db.collection('posts').doc();
  await postRef.set({
    title,
    content,
    slug,
    excerpt,
    status: 'draft', // Always created as a draft first
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    imageUrl: '', // Initialize with an empty string
    likes: 0,
  });
  return postRef.id;
}

export async function getAllPosts(): Promise<Post[]> {
    try {
        const db = adminDb();
        const postsRef = db.collection('posts').orderBy('createdAt', 'desc');
        const snapshot = await postsRef.get();
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                slug: data.slug,
                content: data.content,
                status: data.status,
                createdAt: (data.createdAt as Timestamp).toDate(),
                updatedAt: (data.updatedAt as Timestamp).toDate(),
                imageUrl: data.imageUrl,
                excerpt: data.excerpt,
                likes: data.likes || 0,
            } as Post;
        });
    } catch (error) {
        console.error(`Error fetching all posts:`, error);
        throw new Error(`Failed to fetch all posts. Reason: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
}

export async function getPublishedPosts(): Promise<Post[]> {
    try {
        const db = adminDb();
        const postsRef = db.collection('posts')
            .where('status', '==', 'published')
            .orderBy('createdAt', 'desc');
        const snapshot = await postsRef.get();
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                slug: data.slug,
                content: data.content,
                status: data.status,
                createdAt: (data.createdAt as Timestamp).toDate(),
                updatedAt: (data.updatedAt as Timestamp).toDate(),
                imageUrl: data.imageUrl,
                excerpt: data.excerpt,
                likes: data.likes || 0,
            } as Post;
        });
    } catch (error) {
        console.error(`Error fetching published posts:`, error);
        throw new Error(`Failed to fetch published posts. Reason: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
}

export async function getPostById(id: string): Promise<Post | null> {
    try {
        const db = adminDb();
        const postRef = db.collection('posts').doc(id);
        const doc = await postRef.get();
        if (!doc.exists) {
            return null;
        }
        const data = doc.data()!;
        return {
            id: doc.id,
            title: data.title,
            slug: data.slug,
            content: data.content,
            status: data.status,
            createdAt: (data.createdAt as Timestamp).toDate(),
            updatedAt: (data.updatedAt as Timestamp).toDate(),
            imageUrl: data.imageUrl,
            excerpt: data.excerpt,
            likes: data.likes || 0,
        } as Post;
    } catch (error) {
        console.error(`Error fetching post by ID ${id}:`, error);
        throw new Error(`Failed to fetch post by ID ${id}. Reason: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
}

export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
    try {
        const db = adminDb();
        const q = db.collection('posts')
            .where('slug', '==', slug)
            .where('status', '==', 'published')
            .limit(1);
        const snapshot = await q.get();

        if (snapshot.empty) {
            return null;
        }
        const doc = snapshot.docs[0];
        const data = doc.data()!;
         return {
            id: doc.id,
            title: data.title,
            slug: data.slug,
            content: data.content,
            status: data.status,
            createdAt: (data.createdAt as Timestamp).toDate(),
            updatedAt: (data.updatedAt as Timestamp).toDate(),
            imageUrl: data.imageUrl,
            excerpt: data.excerpt,
            likes: data.likes || 0,
        } as Post;
    } catch (error) {
        console.error(`Error fetching post by slug ${slug}:`, error);
        throw new Error(`Failed to fetch post by slug ${slug}. Reason: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
}


export async function updatePost(id: string, postData: { title: string; content: string; imageUrl?: string }): Promise<void> {
    const db = adminDb();
    const { title, content, imageUrl } = postData;
    const slug = slugify(title);
    const excerpt = content.substring(0, 150) + '...';

    const postRef = db.collection('posts').doc(id);
    
    const updateData: { [key: string]: any } = {
        title,
        content,
        slug,
        excerpt,
        updatedAt: FieldValue.serverTimestamp(),
    };

    if (imageUrl !== undefined) {
        updateData.imageUrl = imageUrl;
    }

    await postRef.update(updateData);
}

export async function updatePostStatus(id: string, status: 'published' | 'draft'): Promise<Post> {
    const db = adminDb();
    const postRef = db.collection('posts').doc(id);
    await postRef.update({
        status,
        updatedAt: FieldValue.serverTimestamp(),
    });

    const updatedDoc = await postRef.get();
    return getPostById(updatedDoc.id) as Promise<Post>; // We know it exists
}

export async function incrementPostLikes(id: string): Promise<void> {
    const db = adminDb();
    const postRef = db.collection('posts').doc(id);
    await postRef.update({
        likes: FieldValue.increment(1),
    });
}
