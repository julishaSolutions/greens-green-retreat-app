
'use server';
/**
 * @fileOverview A multi-agent AI assistant for Green's Green Retreat.
 * This file defines a supervisor agent that routes queries to specialized agents.
 *
 * - askAIAssistant - The main entry point for the chat widget.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getAllAgentConfigs, getKnowledgeBase, type AgentConfig } from '@/services/systemService';
import { generateSpeech } from './text-to-speech';

// Define the structure of a single message in the chat history
const HistoryMessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});

// Define the input schema for the AI assistant flow
const AIAssistantInputSchema = z.object({
  query: z.string().describe("The user's question."),
  history: z.array(HistoryMessageSchema).describe('The conversation history.'),
});
export type AIAssistantInput = z.infer<typeof AIAssistantInputSchema>;

// Define the output schema to include both text and audio
const AIAssistantOutputSchema = z.object({
  text: z.string(),
  audioDataUri: z.string().optional(),
});
export type AIAssistantOutput = z.infer<typeof AIAssistantOutputSchema>;


/**
 * Selects the best agent based on keywords in the user's query.
 * This is much faster than using an LLM for routing.
 * @param query - The user's input string.
 * @param agents - The list of available agent configurations.
 * @returns The chosen AgentConfig.
 */
function selectAgentWithKeywords(query: string, agents: AgentConfig[]): AgentConfig {
    const lowerCaseQuery = query.toLowerCase();

    // Define keywords for each agent. These should be chosen carefully.
    const keywordMap: { [agentId: string]: string[] } = {
        'bookingProcessTool': ['book', 'booking', 'reservation', 'reserve', 'payment', 'pay', 'confirm'],
        'accommodationsTool': ['cottage', 'treehouse', 'room', 'price', 'cost', 'how much', 'stay'],
        'activitiesTool': ['activity', 'activities', 'things to do', 'slides', 'boat', 'fishing', 'watch'],
    };

    for (const agentId in keywordMap) {
        const keywords = keywordMap[agentId];
        if (keywords.some(keyword => lowerCaseQuery.includes(keyword))) {
            const agent = agents.find(a => a.id === agentId);
            if (agent) return agent;
        }
    }

    // If no keywords match, fall back to the general inquiry tool.
    const generalAgent = agents.find(a => a.id === 'generalInquiryTool');
    if (!generalAgent) {
        // This should theoretically never happen if defaults are seeded correctly.
        throw new Error("CRITICAL: Default 'generalInquiryTool' agent not found.");
    }
    return generalAgent;
}


// This flow is now optimized to be much faster.
const aiAssistantFlow = ai.defineFlow(
  {
    name: 'aiAssistantFlow',
    inputSchema: AIAssistantInputSchema,
    outputSchema: AIAssistantOutputSchema,
  },
  async ({ query, history }) => {
    // 1. Fetch agent configurations and knowledge base in parallel.
    const [agentConfigs, knowledgeBase] = await Promise.all([
      getAllAgentConfigs(),
      getKnowledgeBase(),
    ]);

    // 2. Select the specialist agent using fast keyword matching.
    const chosenAgent = selectAgentWithKeywords(query, agentConfigs);
    
    // 3. Make a single LLM call for the specialist agent to answer.
    const specialistResponse = await ai.generate({
        model: 'googleai/gemini-2.0-flash',
        system: `${chosenAgent.systemPrompt}\n\nKnowledge Base:\n---\n${knowledgeBase}\n---`,
        prompt: query,
        history: history.map(msg => ({
            role: msg.role,
            content: [{ text: msg.content }]
        }))
    });
    
    const responseText = specialistResponse.text;

    if (!responseText) {
        return { text: "I'm sorry, but I encountered an issue and can't respond right now. Please try again in a moment." };
    }
    
    // 4. Generate speech in parallel with the text response.
    try {
      const speechPromise = generateSpeech(responseText);
      const [{ audioDataUri }] = await Promise.all([speechPromise]);
      
      return {
        text: responseText,
        audioDataUri: audioDataUri,
      };

    } catch (speechError) {
      console.error("TTS generation failed, returning text only.", speechError);
      // If speech generation fails, we still return the text response.
      return { text: responseText, audioDataUri: undefined };
    }
  }
);

// Exported function to be called from the client-side chat widget
export async function askAIAssistant(input: AIAssistantInput): Promise<AIAssistantOutput> {
  return aiAssistantFlow(input);
}
