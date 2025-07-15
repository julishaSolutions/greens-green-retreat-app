import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';

test.describe('AI Chatbot', () => {

  test.beforeAll(() => {
    // Run the seeding script to ensure AI agents and knowledge base are set up
    try {
      console.log('Seeding database for chatbot tests...');
      execSync('npx ts-node tests/seed.ts', { stdio: 'inherit' });
    } catch (error) {
      console.error('Failed to seed database:', error);
      process.exit(1);
    }
  });

  test('should answer questions about cottage capacity', async ({ page }) => {
    // Start at the homepage
    await page.goto('/');

    // 1. Open the chat widget
    const chatTrigger = page.getByRole('button', { name: "Talk to Greens' Assistant" });
    await expect(chatTrigger).toBeVisible();
    await chatTrigger.click();

    // 2. Wait for the chat popover to be visible
    const chatPopover = page.getByRole('dialog', { name: "Greens' Assistant" });
    await expect(chatPopover).toBeVisible();

    // 3. Check for the initial greeting from the bot
    await expect(chatPopover.getByText(/Hello! I'm the assistant for Green's Green Retreat/)).toBeVisible();

    // 4. Ask a question about cottage capacity
    const question = 'How many people can stay in Olivia Cottage?';
    await chatPopover.getByPlaceholder('Ask about our cottages...').fill(question);
    await chatPopover.getByRole('button', { name: 'Send' }).click();
    
    // 5. Verify the user's message appears
    await expect(chatPopover.getByText(question)).toBeVisible();

    // 6. Wait for the AI's response and verify its content
    // We look for a response that contains keywords from the knowledge base.
    const responseLocator = chatPopover.locator('.prose').filter({ hasText: /accommodates up to 8 guests/ });
    await expect(responseLocator).toBeVisible({ timeout: 20000 }); // Increase timeout for AI response
  });
});
