
'use server';
/**
 * @fileOverview An AI assistant for the Green's Green Retreat website.
 *
 * - askAIAssistant - A function that takes a user query and conversation history, and returns a response from the AI.
 */

import { ai } from '@/ai/genkit';
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

// This is the static knowledge base that will be provided to the AI.
const KNOWLEDGE_BASE = `
You are a friendly and helpful assistant for Green's Green Retreat, a luxury nature retreat.
Your goal is to answer guest questions and encourage them to book a stay.
You MUST answer questions ONLY using the information provided in the Knowledge Base below.
If the user asks a question that cannot be answered with the knowledge base, you MUST politely say: "I can only answer questions about Green's Green Retreat. Is there anything I can help you with regarding our accommodations, activities, or booking process?"
Do not make up any information. Keep your answers concise, helpful, and welcoming.

Here is the Knowledge Base:
---
**Booking Information:**
To book, guests should call +254 714 281 791 or visit the 'Inquire Now' page on our website. We use a direct inquiry process to provide the most personal service. To confirm a booking, please pay the full amount before check-in day via Paybill: 625625, Account: 01520262670600. Check-in is at 10:30 AM, and check-out is at 12:00 PM the following day.

**Dining:**
We offer a self-catering model. Each cottage has a well-equipped kitchen. Day visitors have access to a communal kitchen and BBQ pits. We also have chefs available for hire on a daily rate.

**Accommodations:**
- **Alma 1 Treehouse**: A cozy and magical treehouse experience perfect for couples. It accommodates up to 2 guests and is priced at Kes 14,000 per night.
- **Alma 2 Treehouse**: Similar to Alma 1, this treehouse offers a unique stay for up to 2 guests at Kes 14,000 per night.
- **Olivia Cottage**: A large and spacious cottage ideal for families or groups, accommodating up to 8 guests. It is priced at Kes 40,000 per night.
- **The Nest**: A secluded and romantic cottage, perfect for 2 guests seeking privacy. It is priced at Kes 14,000 per night.

**Activities:**
- **Water Slides**: Enjoy a thrilling ride down our exciting water slides.
- **Boat Riding**: Take a peaceful and relaxing boat ride on the dam.
- **Fishing**: You are welcome to bring your own fishing gear and enjoy fishing in our well-stocked dam.
- **Bird Watching**: The retreat is home to diverse birdlife, perfect for bird watching enthusiasts.
---
`;

// The main flow function for the AI assistant
const aiAssistantFlow = ai.defineFlow(
  {
    name: 'aiAssistantFlow',
    inputSchema: AIAssistantInputSchema,
    outputSchema: AIAssistantOutputSchema,
  },
  async ({ query, history }) => {
    
    const { response } = await ai.generate({
        model: 'googleai/gemini-2.0-flash',
        system: KNOWLEDGE_BASE,
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
