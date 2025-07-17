
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

// This script seeds the Firestore emulator with data for testing.
// It's designed to be run before Playwright tests start.

const COTTAGE_DATA = [
    {
        id: 'cottage-1',
        name: 'Alma 1 Treehouse',
        price: 14000,
        guests: 2,
        slug: 'alma-1-treehouse',
        description: 'A cozy and magical treehouse experience perfect for couples.',
        imageUrls: [
            'https://res.cloudinary.com/dx6zxdlts/image/upload/v1751711841/GGR_through_the_lens_of_a_client._happyclient_%EF%B8%8F_greens_green_retreat_8_gz71bu.jpg'
        ]
    },
    {
        id: 'cottage-2',
        name: 'Olivia Cottage',
        price: 40000,
        guests: 8,
        slug: 'olivia-cottage',
        description: 'A large and spacious cottage ideal for families or groups.',
        imageUrls: [
            'https://res.cloudinary.com/dx6zxdlts/image/upload/v1751714095/Beautiful_afternoon_by_the_dam_nothing_beats_it_..._outdoorlife_outdoorliving_outdoor_hgsrny.jpg'
        ]
    }
];

const AI_AGENT_CONFIG_DATA = [
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
    id: 'accommodationsTool',
    name: 'Accommodations Agent',
    description: 'Use when the user asks about specific cottages, their amenities, capacity, or pricing.',
    systemPrompt: `You are a specialized accommodations assistant. Answer questions about cottages, treehouses, amenities, and pricing using ONLY the provided knowledge base. Always respond in the same language the user is using.`
  },
];

const KNOWLEDGE_BASE_DATA = {
    content: `
**Booking Information:**
To book, guests should call +254 714 281 791 or visit the 'Inquire Now' page on our website. 

**Accommodations:**
- **Alma 1 Treehouse**: Accommodates up to 2 guests.
- **Olivia Cottage**: Accommodates up to 8 guests. It is very spacious.
`
};


console.log('Starting Firestore emulator seeding...');

// Point to the emulator using the correct port from firebase.json
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8085';

// Initialize Firebase Admin SDK
// Using dummy credentials because the emulator doesn't require real authentication
try {
  initializeApp({
    credential: cert({
      projectId: 'verdant-getaways-test',
      clientEmail: 'test@example.com',
      // The private key is not used by the emulator, but the format must be valid.
      privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC3y7v2Ym5x8w\nN1VzV/aG7v8Q1jY4eM4c8jX9Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV\n7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8f\nV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\nfV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8fV7Z8\n-----END PRIVATE KEY-----\n',
    }),
    projectId: 'verdant-getaways-test',
  });
} catch(e) {
  // Ignore error if app is already initialized, which can happen in test environments
  if ((e as any).code !== 'app/duplicate-app') {
    console.error("Firebase Admin initialization failed:", e);
    process.exit(1);
  }
}

const db = getFirestore();

async function seedCollection(collectionName: string, data: any[]) {
    console.log(`Seeding collection: ${collectionName}`);
    const collectionRef = db.collection(collectionName);
    const batch = db.batch();

    // Clear existing data
    const snapshot = await collectionRef.get();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    console.log(`Cleared existing documents in ${collectionName}.`);

    // Add new data
    const newBatch = db.batch();
    data.forEach(item => {
        const docRef = collectionRef.doc(item.id);
        newBatch.set(docRef, item);
    });
    await newBatch.commit();
    console.log(`Seeded ${data.length} documents into ${collectionName}.`);
}

async function seedDocument(collectionName: string, docId: string, data: any) {
    console.log(`Seeding document: ${collectionName}/${docId}`);
    const docRef = db.collection(collectionName).doc(docId);
    await docRef.set(data);
    console.log(`Seeded document ${collectionName}/${docId}.`);
}


async function main() {
    try {
        await seedCollection('cottages', COTTAGE_DATA);
        await seedCollection('ai_agents', AI_AGENT_CONFIG_DATA);
        await seedDocument('system_settings', 'knowledge_base', KNOWLEDGE_BASE_DATA);
        console.log('✅ Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    }
}

main();

    