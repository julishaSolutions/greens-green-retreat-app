
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
};

export async function createPost(postData: { title: string; content: string }): Promise<string> {
  if (!adminDb) {
    throw new Error("Content service is not available. Database not configured.");
  }
  const { title, content } = postData;
  const slug = slugify(title);
  const excerpt = content.substring(0, 150) + '...';

  const postRef = adminDb.collection('posts').doc();
  await postRef.set({
    title,
    content,
    slug,
    excerpt,
    status: 'draft', // Always created as a draft first
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    imageUrl: '', // Initialize with an empty string
  });
  return postRef.id;
}

export async function getAllPosts(): Promise<Post[]> {
    if (!adminDb) {
        console.warn('Firestore Admin is not initialized. Cannot fetch posts.');
        return [];
    }
    try {
        const postsRef = adminDb.collection('posts').orderBy('createdAt', 'desc');
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
            } as Post;
        });
    } catch (error) {
        console.error(`Error fetching all posts:`, error);
        return [];
    }
}

export async function getPublishedPosts(): Promise<Post[]> {
    if (!adminDb) {
        console.warn('Firestore Admin is not initialized. Cannot fetch posts.');
        return [];
    }
    try {
        const postsRef = adminDb.collection('posts')
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
            } as Post;
        });
    } catch (error) {
        console.error(`Error fetching published posts:`, error);
        return [];
    }
}

export async function getPostById(id: string): Promise<Post | null> {
    if (!adminDb) {
        console.warn('Firestore Admin is not initialized. Cannot fetch post.');
        return null;
    }
    try {
        const postRef = adminDb.collection('posts').doc(id);
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
        } as Post;
    } catch (error) {
        console.error(`Error fetching post by ID ${id}:`, error);
        return null;
    }
}

export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
    if (!adminDb) {
        console.warn('Firestore Admin is not initialized. Cannot fetch post.');
        return null;
    }
    try {
        const q = adminDb.collection('posts')
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
        } as Post;
    } catch (error) {
        console.error(`Error fetching post by slug ${slug}:`, error);
        return null;
    }
}


export async function updatePost(id: string, postData: { title: string; content: string; imageUrl?: string }): Promise<void> {
    if (!adminDb) {
        throw new Error("Content service is not available. Database not configured.");
    }
    const { title, content, imageUrl } = postData;
    const slug = slugify(title);
    const excerpt = content.substring(0, 150) + '...';

    const postRef = adminDb.collection('posts').doc(id);
    
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
    if (!adminDb) {
        throw new Error("Content service is not available. Database not configured.");
    }
    const postRef = adminDb.collection('posts').doc(id);
    await postRef.update({
        status,
        updatedAt: FieldValue.serverTimestamp(),
    });

    const updatedDoc = await postRef.get();
    return getPostById(updatedDoc.id) as Promise<Post>; // We know it exists
}
