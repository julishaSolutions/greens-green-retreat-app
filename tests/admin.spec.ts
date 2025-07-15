import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test('should allow a user to access the admin dashboard', async ({ page }) => {
    // Navigate to the admin page
    await page.goto('/admin');

    // Wait for the page to load and check for a key element
    // In this case, we'll check for the main dashboard title
    const dashboardTitle = page.locator('h1:has-text("Admin Dashboard")');
    await expect(dashboardTitle).toBeVisible();

    // Check for the "Welcome, Administrator!" card title
    const welcomeMessage = page.locator('h2:has-text("Welcome, Administrator!")');
    await expect(welcomeMessage).toBeVisible();

    // Check if the navigation sidebar is present
    const sidebar = page.locator('nav a:has-text("Bookings")');
    await expect(sidebar).toBeVisible();
  });
});
