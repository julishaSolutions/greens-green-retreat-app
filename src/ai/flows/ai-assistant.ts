
'use server';
/**
 * @fileOverview A multi-agent AI assistant for Green's Green Retreat.
 * This file defines a supervisor agent that uses specialized tools to answer user queries.
 *
 * - askAIAssistant - The main entry point for the chat widget.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getAllAgentConfigs, getKnowledgeBase } from '@/services/systemService';

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

// This is the main "Supervisor" flow
const aiAssistantFlow = ai.defineFlow(
  {
    name: 'aiAssistantFlow',
    inputSchema: AIAssistantInputSchema,
    outputSchema: AIAssistantOutputSchema,
  },
  async ({ query, history }) => {
    // 1. Fetch all agent configurations from the database
    const agentConfigs = await getAllAgentConfigs();
    const knowledgeBase = await getKnowledgeBase();

    // 2. Dynamically create a tool for each agent configuration
    const specialistTools = agentConfigs.map(config => {
      return ai.defineTool(
        {
          name: config.id, // e.g., 'generalInquiryTool'
          description: config.description,
          inputSchema: z.object({ query: z.string().describe("The user's original query.") }),
          outputSchema: z.string(),
        },
        async ({ query }) => {
          // This is the logic the tool executes
          const { response } = await ai.generate({
            model: 'googleai/gemini-2.0-flash',
            system: `${config.systemPrompt}\n\nKnowledge Base:\n---\n${knowledgeBase}\n---`,
            prompt: query,
          });
          return response?.text || `I'm sorry, I could not process that request.`;
        }
      );
    });
    
    // 3. Define the supervisor's instructions
    const supervisorSystemPrompt = `You are a supervisor AI for Green's Green Retreat. Your job is to intelligently route the user's query to the correct specialized tool based on its description. Be friendly and helpful. Review the available tools and their descriptions to make the best choice. If no specific tool seems appropriate, use the 'generalInquiryTool'.`;

    const { response } = await ai.generate({
        model: 'googleai/gemini-2.0-flash',
        system: supervisorSystemPrompt,
        history: history.map(msg => ({
            role: msg.role,
            content: [{ text: msg.content }]
        })),
        prompt: query,
        tools: specialistTools,
    });

    return response?.text || "I'm sorry, but I encountered an issue and can't respond right now. Please try again in a moment.";
  }
);

// Exported function to be called from the client-side chat widget
export async function askAIAssistant(input: AIAssistantInput): Promise<AIAssistantOutput> {
  return aiAssistantFlow(input);
}
