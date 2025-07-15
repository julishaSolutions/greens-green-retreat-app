
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { updateKnowledgeBase, updateAgentConfig } from '@/services/systemService';

const knowledgeBaseSchema = z.object({
  knowledgeBase: z.string().min(100, { message: 'Knowledge base must be at least 100 characters long.' }),
});

const agentConfigSchema = z.object({
  id: z.string(),
  description: z.string().min(20, { message: 'Description must be at least 20 characters.' }),
  systemPrompt: z.string().min(50, { message: 'System prompt must be at least 50 characters.' }),
});

export type FormState = {
  message: string;
  errors?: {
    knowledgeBase?: string[];
    description?: string[];
    systemPrompt?: string[];
    form?: string[];
  };
  success: boolean;
};

export async function saveKnowledgeBase(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = knowledgeBaseSchema.safeParse({
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


export async function saveAgentConfig(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = agentConfigSchema.safeParse({
    id: formData.get('id'),
    description: formData.get('description'),
    systemPrompt: formData.get('systemPrompt'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check agent fields.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }
  
  const { id, description, systemPrompt } = validatedFields.data;

  try {
    await updateAgentConfig(id, { description, systemPrompt });
    revalidatePath('/admin/ai-settings');
    return { message: 'Agent configuration saved successfully!', success: true, errors: {} };
  } catch (error) {
    console.error(`Failed to save agent config for ${id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: 'Failed to save agent configuration.',
      errors: { form: [errorMessage] },
      success: false,
    };
  }
}
