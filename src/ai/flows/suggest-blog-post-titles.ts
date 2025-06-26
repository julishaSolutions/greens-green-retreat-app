'use server';

/**
 * @fileOverview An AI agent that analyzes guest reviews and suggests blog post titles.
 *
 * - suggestBlogPostTitles - A function that suggests blog post titles based on guest reviews.
 * - SuggestBlogPostTitlesInput - The input type for the suggestBlogPostTitles function.
 * - SuggestBlogPostTitlesOutput - The return type for the suggestBlogPostTitles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBlogPostTitlesInputSchema = z.object({
  guestReviews: z.string().describe('Recent guest reviews of the retreat.'),
});
export type SuggestBlogPostTitlesInput = z.infer<typeof SuggestBlogPostTitlesInputSchema>;

const SuggestBlogPostTitlesOutputSchema = z.object({
  suggestedTitles: z
    .array(z.string())
    .describe('A list of suggested blog post titles.'),
});
export type SuggestBlogPostTitlesOutput = z.infer<typeof SuggestBlogPostTitlesOutputSchema>;

export async function suggestBlogPostTitles(input: SuggestBlogPostTitlesInput): Promise<SuggestBlogPostTitlesOutput> {
  return suggestBlogPostTitlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBlogPostTitlesPrompt',
  input: {schema: SuggestBlogPostTitlesInputSchema},
  output: {schema: SuggestBlogPostTitlesOutputSchema},
  prompt: `You are a marketing expert for a nature retreat. Your goal is to attract more visitors by suggesting engaging blog post titles based on recent guest reviews.

  Analyze the following guest reviews to identify common positive sentiments and propose 5 blog post titles that highlight these sentiments.

  Guest Reviews: {{{guestReviews}}}

  Format the output as a JSON object with a "suggestedTitles" array containing the suggested titles.
  `,
});

const suggestBlogPostTitlesFlow = ai.defineFlow(
  {
    name: 'suggestBlogPostTitlesFlow',
    inputSchema: SuggestBlogPostTitlesInputSchema,
    outputSchema: SuggestBlogPostTitlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
