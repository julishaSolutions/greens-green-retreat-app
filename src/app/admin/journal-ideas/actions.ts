
'use server';

import { suggestJournalPostTitles } from '@/ai/flows/suggest-journal-post-titles';
import { generateJournalPost } from '@/ai/flows/generate-journal-post';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createPost } from '@/services/postService';

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
    title: string | null;
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
            title: null,
            article: null,
        };
    }

    try {
        const result = await generateJournalPost({ title: validatedFields.data.title });
        if (result.articleContent) {
            return {
                message: 'Successfully generated article!',
                errors: {},
                title: validatedFields.data.title,
                article: result.articleContent,
            };
        } else {
            return {
                message: 'AI could not generate an article for that title.',
                errors: {},
                title: validatedFields.data.title,
                article: null,
            };
        }
    } catch (error) {
        console.error(error);
        return {
            message: 'An unexpected error occurred while generating the article.',
            errors: {},
            title: validatedFields.data.title,
            article: null,
        };
    }
}


// For Saving Article
const saveSchema = z.object({
    title: z.string(),
    content: z.string(),
});

export type SaveArticleFormState = {
    message: string;
    errors?: {
        title?: string[];
        content?: string[];
        form?: string[];
    };
    success: boolean;
}

export async function saveArticle(prevState: SaveArticleFormState, formData: FormData): Promise<SaveArticleFormState> {
    const validatedFields = saveSchema.safeParse({
        title: formData.get('title'),
        content: formData.get('content'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Validation failed. Could not save article.',
            errors: validatedFields.error.flatten().fieldErrors,
            success: false,
        };
    }

    try {
        await createPost(validatedFields.data);
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return {
            message: 'Failed to save article to the database.',
            errors: { form: [errorMessage] },
            success: false,
        };
    }

    revalidatePath('/admin/journal');
    redirect('/admin/journal');
}
