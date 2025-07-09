
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
const AIAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s question.'),
  history: z.array(HistoryMessageSchema).describe('The conversation history.'),
});
export type AIAssistantInput = z.infer<typeof AIAssistantInputSchema>;

// Define the output schema (a simple string response)
const AIAssistantOutputSchema = z.string();
export type AIAssistantOutput = z.infer<typeof AIAssistantOutputSchema>;

// TOOL: Generalist Agent for broad questions
const generalInquiryTool = ai.defineTool(
    {
        name: 'generalInquiryTool',
        description: 'Use for general questions about the retreat, dining, check-in/check-out times, and any query that doesn\'t fit other specific tools. This is your default tool.',
        inputSchema: z.object({
            query: z.string().describe("The user's original question."),
        }),
        outputSchema: z.string(),
    },
    async ({ query }) => {
        const knowledgeBase = await getKnowledgeBase();
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
        description: 'Use when the user asks about how to book, the booking process, making a payment, or booking confirmation.',
        inputSchema: z.object({
            query: z.string().describe("The user's question about booking."),
        }),
        outputSchema: z.string(),
    },
    async ({ query }) => {
        const knowledgeBase = await getKnowledgeBase();
        const { response } = await ai.generate({
             model: 'googleai/gemini-2.0-flash',
             system: `You are a specialized booking assistant. Answer questions about the booking and payment process using ONLY the provided knowledge base.
Knowledge Base:
---
${knowledgeBase}
---`,
             prompt: query,
        });
        return response.text;
    }
);

// TOOL: Accommodations Agent
const accommodationsTool = ai.defineTool(
    {
        name: 'accommodationsTool',
        description: 'Use when the user asks about specific cottages, their amenities, capacity, or pricing.',
        inputSchema: z.object({
            query: z.string().describe("The user's question about accommodations."),
        }),
        outputSchema: z.string(),
    },
    async ({ query }) => {
        const knowledgeBase = await getKnowledgeBase();
        const { response } = await ai.generate({
            model: 'googleai/gemini-2.0-flash',
            system: `You are a specialized accommodations assistant. Answer questions about cottages, treehouses, amenities, and pricing using ONLY the provided knowledge base.
Knowledge Base:
---
${knowledgeBase}
---`,
            prompt: query,
        });
        return response.text;
    }
);

// TOOL: Activities Agent
const activitiesTool = ai.defineTool(
    {
        name: 'activitiesTool',
        description: 'Use when the user asks about available activities like water slides, boat riding, fishing, or bird watching.',
        inputSchema: z.object({
            query: z.string().describe("The user's question about activities."),
        }),
        outputSchema: z.string(),
    },
    async ({ query }) => {
        const knowledgeBase = await getKnowledgeBase();
        const { response } = await ai.generate({
            model: 'googleai/gemini-2.0-flash',
            system: `You are a specialized activities assistant. Answer questions about on-site experiences using ONLY the provided knowledge base.
Knowledge Base:
---
${knowledgeBase}
---`,
            prompt: query,
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
    
    const { response } = await ai.generate({
        model: 'googleai/gemini-2.0-flash',
        system: `You are a supervisor AI for Green's Green Retreat. Your job is to intelligently route the user's query to the correct specialized tool. Be friendly and helpful.
- For questions about booking, payments, or confirmation, use 'bookingProcessTool'.
- For questions about cottages, amenities, capacity, or pricing, use 'accommodationsTool'.
- For questions about water slides, boat rides, or other on-site experiences, use 'activitiesTool'.
- For all other general questions, use the 'generalInquiryTool'.`,
        history: history.map(msg => ({
            role: msg.role,
            content: [{ text: msg.content }]
        })),
        prompt: query,
        tools: [generalInquiryTool, bookingProcessTool, accommodationsTool, activitiesTool],
    });

    return response?.text || "I'm sorry, but I encountered an issue and can't respond right now. Please try again in a moment.";
  }
);

// Exported function to be called from the client-side chat widget
export async function askAIAssistant(input: AIAssistantInput): Promise<AIAssistantOutput> {
  return aiAssistantFlow(input);
}
