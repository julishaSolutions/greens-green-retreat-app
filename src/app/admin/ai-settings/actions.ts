
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { updateKnowledgeBase } from '@/services/systemService';

const FormSchema = z.object({
  knowledgeBase: z.string().min(100, { message: 'Knowledge base must be at least 100 characters long.' }),
});

export type FormState = {
  message: string;
  errors?: {
    knowledgeBase?: string[];
    form?: string[];
  };
  success: boolean;
};

export async function saveKnowledgeBase(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = FormSchema.safeParse({
    knowledgeBase: formData.get('knowledgeBase'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your input.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    await updateKnowledgeBase(validatedFields.data.knowledgeBase);
    revalidatePath('/admin/ai-settings');
    return { message: 'Knowledge base updated successfully!', success: true, errors: {} };
  } catch (error) {
    console.error('Failed to save knowledge base:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: 'Failed to save changes to the database.',
      errors: { form: [errorMessage] },
      success: false,
    };
  }
}
