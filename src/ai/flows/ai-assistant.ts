
'use server';
/**
 * @fileOverview A multi-agent AI assistant for Green's Green Retreat.
 * This file defines a supervisor agent that uses specialized tools to answer user queries.
 *
 * - askAIAssistant - The main entry point for the chat widget.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getKnowledgeBase } from '@/services/systemService';

// Define the structure of a single message in the chat history
const HistoryMessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});

// Define the input schema for the AI assistant flow
export const AIAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s question.'),
  history: z.array(HistoryMessageSchema).describe('The conversation history.'),
});
export type AIAssistantInput = z.infer<typeof AIAssistantInputSchema>;

// Define the output schema (a simple string response)
export const AIAssistantOutputSchema = z.string();
export type AIAssistantOutput = z.infer<typeof AIAssistantOutputSchema>;

// TOOL: Generalist Agent for broad questions
const generalInquiryTool = ai.defineTool(
    {
        name: 'generalInquiryTool',
        description: 'Use for general questions about the retreat, dining, check-in/check-out times, and any query that doesn\'t fit other specific tools. This is your default tool.',
        inputSchema: z.object({
            query: z.string().describe("The user's original question."),
            knowledgeBase: z.string().describe("The retreat's knowledge base."),
        }),
        outputSchema: z.string(),
    },
    async ({ query, knowledgeBase }) => {
        const { response } = await ai.generate({
            model: 'googleai/gemini-2.0-flash',
            system: `You are a friendly and helpful assistant for Green's Green Retreat. Your goal is to answer the user's question based ONLY on the provided knowledge base.
If the user's question cannot be answered from the knowledge base, politely say: "I can only answer questions about Green's Green Retreat. Is there anything I can help you with regarding our accommodations, activities, or booking process?"
Knowledge Base:
---
${knowledgeBase}
---`,
            prompt: query,
        });
        return response.text;
    }
);

// TOOL: Booking Agent
const bookingProcessTool = ai.defineTool(
    {
        name: 'bookingProcessTool',
        description: 'Use when the user asks specifically how to book, make a payment, or about booking confirmation.',
        inputSchema: z.object({
            knowledgeBase: z.string().describe("The retreat's knowledge base."),
        }),
        outputSchema: z.string(),
    },
    async ({ knowledgeBase }) => {
        const { response } = await ai.generate({
             model: 'googleai/gemini-2.0-flash',
             system: `You are a specialized booking assistant. Extract ONLY the booking and payment information from the provided knowledge base and explain it clearly to the user.
Knowledge Base:
---
${knowledgeBase}
---`,
             prompt: 'How do I book a stay and pay for it?',
        });
        return response.text;
    }
);

// This is the main "Supervisor" flow
const aiAssistantFlow = ai.defineFlow(
  {
    name: 'aiAssistantFlow',
    inputSchema: AIAssistantInputSchema,
    outputSchema: AIAssistantOutputSchema,
  },
  async ({ query, history }) => {
    
    // Fetch the live knowledge base from Firestore
    const knowledgeBase = await getKnowledgeBase();

    const { response } = await ai.generate({
        model: 'googleai/gemini-2.0-flash',
        system: `You are a supervisor AI for Green's Green Retreat. Your job is to understand the user's query and use the provided tools to answer it. Be friendly, welcoming, and helpful. Prioritize using the 'generalInquiryTool' unless the query is highly specific to booking.`,
        history: history.map(msg => ({
            role: msg.role,
            content: [{ text: msg.content }]
        })),
        prompt: query,
        tools: [generalInquiryTool, bookingProcessTool],
        toolConfig: {
            // Force the model to use our specialized generalInquiryTool by default
            mode: 'tool', 
            toolChoice: 'generalInquiryTool',
        }
    });

    return response.text;
  }
);

// Exported function to be called from the client-side chat widget
export async function askAIAssistant(input: AIAssistantInput): Promise<AIAssistantOutput> {
  return aiAssistantFlow(input);
}
