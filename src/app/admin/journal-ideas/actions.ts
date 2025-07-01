'use server';

import { suggestJournalPostTitles } from '@/ai/flows/suggest-journal-post-titles';
import { z } from 'zod';

const schema = z.object({
  reviews: z.string().min(50, { message: 'Please enter at least 50 characters of reviews.' }),
});

export type FormState = {
  message: string;
  errors?: {
    reviews?: string[];
  };
  data: string[];
};

export async function getSuggestions(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = schema.safeParse({
    reviews: formData.get('reviews'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your input.',
      errors: validatedFields.error.flatten().fieldErrors,
      data: [],
    };
  }

  try {
    const result = await suggestJournalPostTitles({ guestReviews: validatedFields.data.reviews });
    if (result.suggestedTitles && result.suggestedTitles.length > 0) {
        return {
            message: 'Successfully generated titles!',
            errors: {},
            data: result.suggestedTitles,
        };
    } else {
        return {
            message: 'AI could not generate titles based on the provided text.',
            errors: {},
            data: [],
        }
    }
  } catch (error) {
    console.error(error);
    return {
      message: 'An unexpected error occurred while fetching suggestions.',
      errors: {},
      data: [],
    };
  }
}
