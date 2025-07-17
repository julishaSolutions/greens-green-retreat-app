import { test, expect } from '@playwright/test';

test.describe('Public Site Browsing', () => {
  test('should display cottages on the retreat page and allow navigation to details', async ({ page }) => {
    // Start at the homepage
    await page.goto('/');

    // Navigate to "The Retreat" page from the header
    await page.getByRole('link', { name: 'The Retreat' }).click();
    await expect(page).toHaveURL('/the-retreat');
    
    // Check for the main page title
    await expect(page.locator('h1:has-text("The Suites & Cottages")')).toBeVisible();

    // Find the card for "Alma 1 Treehouse" and check its contents
    const almaCottageCard = page.locator('div[id="cottage-1"]');
    await expect(almaCottageCard).toBeVisible();
    await expect(almaCottageCard).toContainText('Kes 14,000 / night');
    await expect(almaCottageCard).toContainText('Up to 2 guests');

    // Click the "Book Now" button on the card (this should navigate to details)
    await almaCottageCard.getByRole('link', { name: 'Book Now' }).click();

    // Wait for navigation and verify the URL is correct for the cottage detail page
    await expect(page).toHaveURL('/booking?cottageId=cottage-1&cottageName=Alma%201%20Treehouse');
    
    // Check that the booking form is visible
    await expect(page.locator('h1:has-text("Book Your Stay")')).toBeVisible();
  });
});
