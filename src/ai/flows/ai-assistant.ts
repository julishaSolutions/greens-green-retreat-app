'use server';
/**
 * @fileOverview An AI assistant for the Green's Green Retreat website.
 *
 * - askAIAssistant - A function that takes a user query and conversation history, and returns a response from the AI.
 */

import { ai } from '@/ai/genkit';
import { getActivities, getCottages, type Cottage, type Activity } from '@/services/contentService';
import { z } from 'genkit';

// Define the structure of a single message in the chat history
const HistoryMessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});

// Define the input schema for the AI assistant flow
const AIAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s question.'),
  history: z.array(HistoryMessageSchema).describe('The conversation history.'),
});
export type AIAssistantInput = z.infer<typeof AIAssistantInputSchema>;

// Define the output schema (a simple string response)
const AIAssistantOutputSchema = z.string();
export type AIAssistantOutput = z.infer<typeof AIAssistantOutputSchema>;

/**
 * Gathers all necessary information for the AI's knowledge base.
 * @returns A formatted string containing details about accommodations, activities, and general info.
 */
async function getKnowledgeBase(): Promise<string> {
    const cottages = await getCottages();
    const activities = await getActivities();

    const formatCottages = (cottages: Cottage[]): string => {
        if (!cottages.length) return 'No accommodation details available.';
        return cottages
            .map(c => `- **${c.name}**: ${c.description} Priced at Kes ${c.price?.toLocaleString() || 'N/A'} per night for up to ${c.guests} guests.`)
            .join('\n');
    };

    const formatActivities = (activities: Activity[]): string => {
        if (!activities.length) return 'No activity details available.';
        return activities
            .map(a => `- **${a.name}**: ${a.description}`)
            .join('\n');
    };

    return `
**Booking Information:**
To book, guests should call +254 714 281 791 or visit the 'Inquire Now' page on our website. We use a direct inquiry process to provide the most personal service. To confirm a booking, please pay the full amount before check-in day via Paybill: 625625, Account: 01520262670600. Check-in is at 10:30 AM, and check-out is at 12:00 PM the following day.

**Dining:**
We offer a self-catering model. Each cottage has a well-equipped kitchen. Day visitors have access to a communal kitchen and BBQ pits. We also have chefs available for hire on a daily rate.

**Accommodations:**
${formatCottages(cottages)}

**Activities:**
${formatActivities(activities)}
    `.trim();
}

const prompt = ai.definePrompt({
    name: 'aiAssistantPrompt',
    input: { schema: z.object({ knowledgeBase: z.string() }) },
    prompt: `You are a friendly and helpful assistant for Green's Green Retreat, a luxury nature retreat.
Your goal is to answer guest questions and encourage them to book a stay.
You MUST answer questions ONLY using the information provided in the Knowledge Base below.
If the user asks a question that cannot be answered with the knowledge base, you MUST politely say: "I can only answer questions about Green's Green Retreat. Is there anything I can help you with regarding our accommodations, activities, or booking process?"
Do not make up any information. Keep your answers concise, helpful, and welcoming.

Here is the Knowledge Base:
---
{{{knowledgeBase}}}
---
`,
});

// The main flow function for the AI assistant
const aiAssistantFlow = ai.defineFlow(
  {
    name: 'aiAssistantFlow',
    inputSchema: AIAssistantInputSchema,
    outputSchema: AIAssistantOutputSchema,
  },
  async ({ query, history }) => {
    
    const knowledgeBase = await getKnowledgeBase();

    const { response } = await ai.generate({
        model: prompt.model,
        system: await prompt.render({ input: { knowledgeBase } }),
        history: history.map(msg => ({
            role: msg.role,
            content: [{ text: msg.content }]
        })),
        prompt: query
    });

    return response.text;
  }
);


// Exported function to be called from the client-side chat widget
export async function askAIAssistant(input: AIAssistantInput): Promise<AIAssistantOutput> {
  return aiAssistantFlow(input);
}
