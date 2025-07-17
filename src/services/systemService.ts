
'use server';

import { adminDb } from '@/lib/firebase-admin';

const KB_COLLECTION = 'system_settings';
const KB_DOC_ID = 'knowledge_base';
const AGENT_COLLECTION = 'ai_agents';

export type AgentConfig = {
  id: string; // The tool name, e.g., 'generalInquiryTool'
  name: string; // A user-friendly name, e.g., 'General Inquiry Agent'
  description: string; // For the supervisor AI
  systemPrompt: string; // The instructions for the specialist agent
};

const DEFAULT_AGENTS: AgentConfig[] = [
  {
    id: 'generalInquiryTool',
    name: 'General Inquiry Agent',
    description: "Use for general questions about the retreat, dining, check-in/check-out times, and any query that doesn't fit other specific tools. This is your default tool.",
    systemPrompt: `You are a friendly and helpful assistant for Green's Green Retreat.
- First, handle any conversational greetings or introductory phrases naturally.
- Then, your main goal is to answer the user's question based ONLY on the provided knowledge base.
- If the user's question cannot be answered from the knowledge base, politely say: "I can only answer questions about Green's Green Retreat. Is there anything I can help you with regarding our accommodations, activities, or booking process?"
- Always respond in the same language the user is using.`
  },
  {
    id: 'bookingProcessTool',
    name: 'Booking Process Agent',
    description: 'Use when the user asks about how to book, the booking process, making a payment, or booking confirmation.',
    systemPrompt: `You are a specialized booking assistant. Answer questions about the booking and payment process using ONLY the provided knowledge base. Always respond in the same language the user is using.`
  },
  {
    id: 'accommodationsTool',
    name: 'Accommodations Agent',
    description: 'Use when the user asks about specific cottages, their amenities, capacity, or pricing.',
    systemPrompt: `You are a specialized accommodations assistant. Answer questions about cottages, treehouses, amenities, and pricing using ONLY the provided knowledge base. Always respond in the same language the user is using.`
  },
  {
    id: 'activitiesTool',
    name: 'Activities Agent',
    description: 'Use when the user asks about available activities like water slides, boat riding, fishing, or bird watching.',
    systemPrompt: `You are a specialized activities assistant. Answer questions about on-site experiences using ONLY the provided knowledge base. Always respond in the same language the user is using.`
  }
];

const DEFAULT_KNOWLEDGE_BASE = `
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
`;

/**
 * Fetches the knowledge base content from Firestore.
 * If it doesn't exist, it creates a default one.
 * @returns {Promise<string>} The knowledge base content.
 */
export async function getKnowledgeBase(): Promise<string> {
  try {
    const db = adminDb();
    const docRef = db.collection(KB_COLLECTION).doc(KB_DOC_ID);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.log('[SystemService] Knowledge base not found, creating a default one.');
      await docRef.set({ content: DEFAULT_KNOWLEDGE_BASE });
      return DEFAULT_KNOWLEDGE_BASE;
    }

    return doc.data()?.content || '';
  } catch (error) {
    console.error('Error fetching knowledge base:', error);
    return 'Error: Could not load knowledge base.';
  }
}

/**
 * Updates the knowledge base content in Firestore.
 * @param {string} newContent - The new content to save.
 * @returns {Promise<void>}
 */
export async function updateKnowledgeBase(newContent: string): Promise<void> {
  if (typeof newContent !== 'string') {
    throw new Error('Knowledge base content must be a string.');
  }

  try {
    const db = adminDb();
    const docRef = db.collection(KB_COLLECTION).doc(KB_DOC_ID);
    await docRef.set({ content: newContent }, { merge: true });
    console.log('[SystemService] Knowledge base updated successfully.');
  } catch (error) {
    console.error('Error updating knowledge base:', error);
    throw new Error('Failed to update knowledge base in the database.');
  }
}

/**
 * Initializes the default agent configurations in Firestore if they don't exist.
 */
async function initializeDefaultAgents(): Promise<void> {
  const db = adminDb();
  const agentCollection = db.collection(AGENT_COLLECTION);
  
  try {
    const snapshot = await agentCollection.get();

    if (snapshot.docs.length < DEFAULT_AGENTS.length) {
      console.log('[SystemService] Agent configurations mismatch, re-initializing default agents.');
      const batch = db.batch();
      DEFAULT_AGENTS.forEach(agent => {
        const docRef = agentCollection.doc(agent.id);
        batch.set(docRef, agent);
      });
      await batch.commit();
      console.log('[SystemService] Default agents created/updated successfully.');
    }
  } catch (error) {
     console.error('[SystemService] Failed to initialize default agents:', error);
  }
}

/**
 * Fetches all agent configurations from Firestore.
 * Initializes default agents if none are found.
 * @returns {Promise<AgentConfig[]>} A list of agent configurations.
 */
export async function getAllAgentConfigs(): Promise<AgentConfig[]> {
  await initializeDefaultAgents();
  try {
    const db = adminDb();
    const snapshot = await db.collection(AGENT_COLLECTION).get();
    return snapshot.docs.map(doc => doc.data() as AgentConfig);
  } catch (error) {
    console.error('Error fetching all agent configs:', error);
    return DEFAULT_AGENTS; // Return defaults as a fallback
  }
}

/**
 * Updates a specific agent's configuration in Firestore.
 * @param {string} id - The ID of the agent to update.
 * @param {Partial<AgentConfig>} data - The data to update.
 */
export async function updateAgentConfig(id: string, data: Partial<Omit<AgentConfig, 'id' | 'name'>>): Promise<void> {
  if (!id) {
    throw new Error('Agent ID is required to update configuration.');
  }
  const db = adminDb();
  await db.collection(AGENT_COLLECTION).doc(id).update(data);
  console.log(`[SystemService] Agent configuration for '${id}' updated successfully.`);
}
