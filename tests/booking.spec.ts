
import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import { addDays, format } from 'date-fns';

test.describe('Booking Flow', () => {
  
  test.beforeAll(() => {
    // Run the seeding script before all tests in this file
    try {
      console.log('Seeding database for booking tests...');
      execSync('npx ts-node tests/seed.ts', { stdio: 'inherit' });
    } catch (error) {
      console.error('Failed to seed database:', error);
      process.exit(1);
    }
  });

  test('should allow a user to complete a booking', async ({ page }) => {
    // 1. Navigate directly to the booking page for a specific cottage
    await page.goto('/booking?cottageId=cottage-1&cottageName=Alma%201%20Treehouse');

    // 2. Verify the page has loaded correctly
    await expect(page.locator('h1:has-text("Book Your Stay")')).toBeVisible();
    await expect(page.getByText("You are booking Alma 1 Treehouse.")).toBeVisible();

    // 3. Fill out the guest details
    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Email Address').fill('test@example.com');
    
    // 4. Select dates. Let's pick a date range in the future.
    const checkInDate = addDays(new Date(), 10);
    const checkOutDate = addDays(new Date(), 12);
    const formattedCheckIn = format(checkInDate, 'LLL dd, y');
    const formattedCheckOut = format(checkOutDate, 'LLL dd, y');

    // Open the calendar popover
    await page.getByRole('button', { name: /Pick a date range/ }).click();
    
    // Select the dates. We find the buttons by their accessible names.
    await page.getByRole('button', { name: format(checkInDate, 'd') }).first().click();
    await page.getByRole('button', { name: format(checkOutDate, 'd') }).first().click();

    // Verify the date is shown in the button
    await expect(page.getByRole('button', { name: `${formattedCheckIn} - ${formattedCheckOut}`})).toBeVisible();
    
    // 5. Submit the booking form
    await page.getByRole('button', { name: 'Complete Booking' }).click();

    // 6. Verify the success state and payment link
    await expect(page.locator('h2:has-text("Booking Request Sent!")')).toBeVisible({ timeout: 10000 });
    const paymentLink = page.getByRole('link', { name: 'Click Here to Pay Now' });
    await expect(paymentLink).toBeVisible();
    
    const href = await paymentLink.getAttribute('href');
    expect(href).toContain('https://payment.intasend.com/pay/');
    expect(href).toContain('tracking_id='); // Checks that a booking ID was generated and added to the link
  });
});
