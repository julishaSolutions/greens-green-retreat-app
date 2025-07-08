'use server';

/**
 * @fileOverview An AI agent that analyzes guest reviews and suggests journal post titles.
 *
 * - suggestJournalPostTitles - A function that suggests journal post titles based on guest reviews.
 * - SuggestJournalPostTitlesInput - The input type for the suggestJournalPostTitles function.
 * - SuggestJournalPostTitlesOutput - The return type for the suggestJournalPostTitles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestJournalPostTitlesInputSchema = z.object({
  guestReviews: z.string().describe('Recent guest reviews of the retreat.'),
});
export type SuggestJournalPostTitlesInput = z.infer<typeof SuggestJournalPostTitlesInputSchema>;

const SuggestJournalPostTitlesOutputSchema = z.object({
  suggestedTitles: z
    .array(z.string())
    .describe('A list of suggested journal post titles.'),
});
export type SuggestJournalPostTitlesOutput = z.infer<typeof SuggestJournalPostTitlesOutputSchema>;

export async function suggestJournalPostTitles(input: SuggestJournalPostTitlesInput): Promise<SuggestJournalPostTitlesOutput> {
  return suggestJournalPostTitlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestJournalPostTitlesPrompt',
  input: {schema: SuggestJournalPostTitlesInputSchema},
  output: {schema: SuggestJournalPostTitlesOutputSchema},
  prompt: `You are a marketing expert for a luxury nature retreat called Green's Green Retreat. Your goal is to attract more visitors by suggesting engaging journal post titles based on recent guest reviews. The journal's tone is serene, authentic, and focused on wellness and nature.

  Analyze the following guest reviews to identify common positive sentiments and propose 5 journal post titles that highlight these sentiments. The titles should be clean plain text, without any special characters like '#', '*', or '_'.

  Guest Reviews: {{{guestReviews}}}

  Format the output as a JSON object with a "suggestedTitles" array containing the suggested titles.
  `,
});

const suggestJournalPostTitlesFlow = ai.defineFlow(
  {
    name: 'suggestJournalPostTitlesFlow',
    inputSchema: SuggestJournalPostTitlesInputSchema,
    outputSchema: SuggestJournalPostTitlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
