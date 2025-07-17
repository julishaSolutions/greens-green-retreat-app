
'use server';
/**
 * @fileOverview A multi-agent AI assistant for Green's Green Retreat.
 * This file defines a supervisor agent that routes queries to specialized agents.
 *
 * - askAIAssistant - The main entry point for the chat widget.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getAllAgentConfigs, getKnowledgeBase } from '@/services/systemService';
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

// This is the main "Supervisor" flow, which now uses a two-step router pattern.
const aiAssistantFlow = ai.defineFlow(
  {
    name: 'aiAssistantFlow',
    inputSchema: AIAssistantInputSchema,
    outputSchema: AIAssistantOutputSchema,
  },
  async ({ query, history }) => {
    // 1. Fetch all agent configurations and the knowledge base from the database
    const agentConfigs = await getAllAgentConfigs();
    const knowledgeBase = await getKnowledgeBase();

    // 2. Create a prompt for the supervisor listing available agents
    const availableAgentsPrompt = agentConfigs
      .map(agent => `- ${agent.id}: ${agent.description}`)
      .join('\n');

    const supervisorSystemPrompt = `You are a supervisor AI for Green's Green Retreat. Your job is to intelligently route the user's query to the correct specialized agent based on its description. Review the available agents below and respond with ONLY the ID of the best agent to use (e.g., 'generalInquiryTool').

Available Agents:
${availableAgentsPrompt}

If no specific agent seems appropriate, choose 'generalInquiryTool'.`;

    // 3. First LLM call: Supervisor chooses the agent.
    const supervisorChoiceResponse = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: `User Query: "${query}"\n\nBased on the user query, which agent ID should handle this?`,
      system: supervisorSystemPrompt,
      output: {
        schema: z.object({
          agentId: z.string().describe("The ID of the agent to use, e.g., 'generalInquiryTool'"),
        })
      }
    });

    const chosenAgentId = supervisorChoiceResponse.output?.agentId;
    
    if (!chosenAgentId) {
      console.error("Supervisor failed to choose an agent. Raw response:", supervisorChoiceResponse.text);
      return { text: "I'm sorry, I'm having trouble routing your request. Please try again." };
    }
    
    // 4. Find the configuration for the chosen agent
    let chosenAgent = agentConfigs.find(agent => agent.id === chosenAgentId);
    
    if (!chosenAgent) {
        console.warn(`Supervisor chose an invalid agent ID: '${chosenAgentId}'. Falling back to general agent.`);
        chosenAgent = agentConfigs.find(agent => agent.id === 'generalInquiryTool');
        if (!chosenAgent) {
            console.error("Critical error: Could not find fallback 'generalInquiryTool' agent.");
            return { text: "I'm sorry, a critical internal error occurred. Please contact support." };
        }
    }

    // 5. Second LLM call: Specialist agent answers the query using the full history.
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
    
    // 6. Generate speech in parallel with the text response.
    try {
      // We don't await here directly, we let Promise.all handle it.
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
