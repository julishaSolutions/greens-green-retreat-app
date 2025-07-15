
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { updatePost, updatePostStatus } from '@/services/postService';

const FormSchema = z.object({
  id: z.string(),
  title: z.string().min(10, { message: 'Title must be at least 10 characters long.' }),
  content: z.string().min(50, { message: 'Content must be at least 50 characters long.' }),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

export type EditFormState = {
  message: string;
  errors?: {
    title?: string[];
    content?: string[];
    imageUrl?: string[];
    form?: string[];
  };
  success: boolean;
};

export async function saveChanges(prevState: EditFormState, formData: FormData): Promise<EditFormState> {
  const validatedFields = FormSchema.safeParse({
    id: formData.get('id'),
    title: formData.get('title'),
    content: formData.get('content'),
    imageUrl: formData.get('imageUrl'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { id, title, content, imageUrl } = validatedFields.data;

  try {
    await updatePost(id, { title, content, imageUrl });
    revalidatePath(`/admin/journal/${id}/edit`);
    revalidatePath(`/admin/journal`);
    revalidatePath(`/journal/${slugify(title)}`); // Revalidate public post page
    return { message: 'Changes saved successfully!', success: true, errors: {} };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: 'Failed to save changes.',
      errors: { form: [errorMessage] },
      success: false,
    };
  }
}

async function handleStatusChange(id: string, status: 'published' | 'draft') {
    let slug = '';
    try {
        const post = await updatePostStatus(id, status);
        slug = post.slug;
    } catch (error) {
        console.error(`Failed to change status for post ${id}:`, error);
    }
    
    revalidatePath(`/admin/journal/${id}/edit`);
    revalidatePath(`/admin/journal`);
    if(slug) {
      revalidatePath(`/journal/${slug}`);
    }
    redirect(`/admin/journal`);
}


export async function publishPost(id: string): Promise<void> {
    await handleStatusChange(id, 'published');
}

export async function unpublishPost(id: string): Promise<void> {
    await handleStatusChange(id, 'draft');
}

// Helper function to re-use slug logic if needed
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
