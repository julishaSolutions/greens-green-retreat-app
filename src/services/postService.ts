
'use server';

import { adminDb } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export type Post = {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
};

export async function createPost(postData: { title: string; content: string }): Promise<string> {
  if (!adminDb) {
    throw new Error("Content service is not available. Database not configured.");
  }
  const { title, content } = postData;
  const postRef = adminDb.collection('posts').doc();
  await postRef.set({
    title,
    content,
    status: 'draft', // Always created as a draft first
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
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
                content: data.content,
                status: data.status,
                createdAt: (data.createdAt as Timestamp).toDate(),
                updatedAt: (data.updatedAt as Timestamp).toDate(),
            } as Post;
        });
    } catch (error) {
        console.error(`Error fetching all posts:`, error);
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
            content: data.content,
            status: data.status,
            createdAt: (data.createdAt as Timestamp).toDate(),
            updatedAt: (data.updatedAt as Timestamp).toDate(),
        } as Post;
    } catch (error) {
        console.error(`Error fetching post by ID ${id}:`, error);
        return null;
    }
}

export async function updatePost(id: string, postData: { title: string; content: string }): Promise<void> {
    if (!adminDb) {
        throw new Error("Content service is not available. Database not configured.");
    }
    const { title, content } = postData;
    const postRef = adminDb.collection('posts').doc(id);
    await postRef.update({
        title,
        content,
        updatedAt: FieldValue.serverTimestamp(),
    });
}

export async function updatePostStatus(id: string, status: 'published' | 'draft'): Promise<void> {
    if (!adminDb) {
        throw new Error("Content service is not available. Database not configured.");
    }
    const postRef = adminDb.collection('posts').doc(id);
    await postRef.update({
        status,
        updatedAt: FieldValue.serverTimestamp(),
    });
}
