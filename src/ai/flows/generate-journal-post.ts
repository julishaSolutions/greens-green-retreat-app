'use server';
/**
 * @fileOverview An AI agent that generates a full journal post from a title.
 *
 * - generateJournalPost - A function that creates an SEO-optimized journal post.
 * - GenerateJournalPostInput - The input type for the generateJournalPost function.
 * - GenerateJournalPostOutput - The return type for the generateJournalPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateJournalPostInputSchema = z.object({
  title: z.string().describe('The title of the journal post to generate.'),
});
export type GenerateJournalPostInput = z.infer<typeof GenerateJournalPostInputSchema>;

const GenerateJournalPostOutputSchema = z.object({
  articleContent: z
    .string()
    .describe(
      'The full, SEO-optimized journal post content, written in Markdown format. It should be at least 4 paragraphs long and have a serene and authentic tone.'
    ),
});
export type GenerateJournalPostOutput = z.infer<typeof GenerateJournalPostOutputSchema>;

export async function generateJournalPost(input: GenerateJournalPostInput): Promise<GenerateJournalPostOutput> {
  return generateJournalPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJournalPostPrompt',
  input: {schema: GenerateJournalPostInputSchema},
  output: {schema: GenerateJournalPostOutputSchema},
  prompt: `You are a content creator and SEO expert for a luxury nature retreat called "Green's Green Retreat".
Your audience consists of individuals, families, and professionals seeking escape, wellness, connection with nature, and authentic experiences. They value tranquility, adventure, family memories, and personal well-being. Their goals and aspirations are to find peace, recharge from busy city life, and create lasting memories with loved ones.

Your task is to write a full-length, SEO-optimized journal post based on the following title:
"{{{title}}}"

The article should be at least 4-5 paragraphs long, written in Markdown format. The tone must be serene, authentic, and inspiring, resonating with the needs and values of the target audience.

Incorporate keywords naturally related to the title, as well as themes of: wellness, nature, luxury retreat, Tigoni, Limuru, family getaway, digital detox, farm-to-table, and sustainable travel.

Structure the output as a JSON object with an "articleContent" field containing the full Markdown text of the post.`,
});

const generateJournalPostFlow = ai.defineFlow(
  {
    name: 'generateJournalPostFlow',
    inputSchema: GenerateJournalPostInputSchema,
    outputSchema: GenerateJournalPostOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('The AI model did not return any output.');
      }
      return output;
    } catch (error) {
       console.error("Error in generateJournalPostFlow:", error);
       throw new Error("Failed to generate journal post. The AI model may have returned an error or blocked the response.");
    }
  }
);
