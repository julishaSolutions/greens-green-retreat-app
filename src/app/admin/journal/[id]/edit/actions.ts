
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { updatePost, updatePostStatus } from '@/services/postService';

const FormSchema = z.object({
  id: z.string(),
  title: z.string().min(10, { message: 'Title must be at least 10 characters long.' }),
  content: z.string().min(50, { message: 'Content must be at least 50 characters long.' }),
});

export type EditFormState = {
  message: string;
  errors?: {
    title?: string[];
    content?: string[];
    form?: string[];
  };
  success: boolean;
};

export async function saveChanges(prevState: EditFormState, formData: FormData): Promise<EditFormState> {
  const validatedFields = FormSchema.safeParse({
    id: formData.get('id'),
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { id, title, content } = validatedFields.data;

  try {
    await updatePost(id, { title, content });
    revalidatePath(`/admin/journal/${id}/edit`);
    revalidatePath(`/admin/journal`);
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

const StatusSchema = z.object({
    id: z.string(),
    status: z.enum(['draft', 'published']),
});

export async function changeStatus(formData: FormData): Promise<void> {
    const validatedFields = StatusSchema.safeParse({
        id: formData.get('id'),
        status: formData.get('status'),
    });
    
    if (!validatedFields.success) {
        // This should not happen with button clicks, but good to handle.
        console.error('Invalid status change attempt');
        return;
    }
    
    const { id, status } = validatedFields.data;
    
    try {
        await updatePostStatus(id, status);
    } catch (error) {
        console.error(error);
        // We could return an error state, but for this simple action, we'll log and redirect.
    }
    
    revalidatePath(`/admin/journal/${id}/edit`);
    revalidatePath(`/admin/journal`);
    redirect(`/admin/journal`);
}
