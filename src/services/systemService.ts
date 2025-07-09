
'use server';

import { adminDb } from '@/lib/firebase-admin';

const KB_COLLECTION = 'system_settings';
const KB_DOC_ID = 'knowledge_base';

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
      const defaultContent = `
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
      await docRef.set({ content: defaultContent });
      return defaultContent;
    }

    return doc.data()?.content || '';
  } catch (error) {
    console.error('Error fetching knowledge base:', error);
    // Return a fallback message on error to prevent chat from breaking
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
