
import { test, expect } from '@playwright/test';

test.describe('Public Site Navigation', () => {

  test('should allow a user to navigate through all main public pages', async ({ page }) => {
    // Start at the homepage
    await page.goto('/');
    await expect(page).toHaveTitle("Green's Green Retreat");

    // Navigate to The Retreat
    await page.getByRole('link', { name: 'The Retreat' }).first().click();
    await expect(page).toHaveURL('/the-retreat');
    await expect(page.locator('h1')).toContainText('The Suites & Cottages');

    // Navigate to Experiences
    await page.getByRole('link', { name: 'Experiences' }).first().click();
    await expect(page).toHaveURL('/experiences');
    await expect(page.locator('h1')).toContainText('GGR: Your Adventure, Your Pace');

    // Navigate to Our Story
    await page.getByRole('link', { name: 'Our Story' }).first().click();
    await expect(page).toHaveURL('/our-story');
    await expect(page.locator('h1')).toContainText('Our Limuru Roots');

    // Navigate to Journal
    await page.getByRole('link', { name: 'Journal' }).first().click();
    await expect(page).toHaveURL('/journal');
    await expect(page.locator('h1')).toContainText('From Our Journal');
    
    // Navigate back to Home via the logo
    await page.getByAltText("Green's Green Retreat Logo").first().click();
    await expect(page).toHaveURL('/');
    await expect(page).toHaveTitle("Green's Green Retreat");
  });

});
