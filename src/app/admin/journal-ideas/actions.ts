'use server';

import { suggestJournalPostTitles } from '@/ai/flows/suggest-journal-post-titles';
import { generateJournalPost } from '@/ai/flows/generate-journal-post';
import { z } from 'zod';

// For Title Suggestions
const titleSchema = z.object({
  reviews: z.string().min(50, { message: 'Please enter at least 50 characters of reviews.' }),
});

export type SuggestionFormState = {
  message: string;
  errors?: {
    reviews?: string[];
  };
  data: string[];
};

export async function getSuggestions(prevState: SuggestionFormState, formData: FormData): Promise<SuggestionFormState> {
  const validatedFields = titleSchema.safeParse({
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

// For Article Generation
const articleSchema = z.object({
  title: z.string().min(10, { message: 'Please enter a title of at least 10 characters.' }),
});

export type ArticleFormState = {
    message: string;
    errors?: {
        title?: string[];
    };
    article: string | null;
}

export async function generateArticle(prevState: ArticleFormState, formData: FormData): Promise<ArticleFormState> {
    const validatedFields = articleSchema.safeParse({
        title: formData.get('title'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Validation failed. Please check your input.',
            errors: validatedFields.error.flatten().fieldErrors,
            article: null,
        };
    }

    try {
        const result = await generateJournalPost({ title: validatedFields.data.title });
        if (result.articleContent) {
            return {
                message: 'Successfully generated article!',
                errors: {},
                article: result.articleContent,
            };
        } else {
            return {
                message: 'AI could not generate an article for that title.',
                errors: {},
                article: null,
            };
        }
    } catch (error) {
        console.error(error);
        return {
            message: 'An unexpected error occurred while generating the article.',
            errors: {},
            article: null,
        };
    }
}
