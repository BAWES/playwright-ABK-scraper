import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

test.describe('Al Ahli Bank Login', () => {
  test('should login to corporate banking', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://online.eahli.com/corp/AuthenticationController?__START_TRAN_FLAG__=Y&FORMSGROUP_ID__=AuthenticationFG&__EVENT_ID__=LOAD&FG_BUTTONS__=LOAD&ACTION.LOAD=Y&AuthenticationFG.LOGIN_FLAG=7&BANK_ID=01&LANGUAGE_ID=001');
    
    // Wait for the page to load and the login form to be visible
    await page.waitForLoadState('networkidle');
    
    // Fill in the login credentials
    // Note: Replace these with actual test credentials
    await page.fill('input[name="AuthenticationFG.USER_PRINCIPAL"]', process.env.AHLI_USERNAME || '');
    await page.fill('input[name="AuthenticationFG.ACCESS_CODE"]', process.env.AHLI_PASSWORD || '');
    
    // Click the login button
    await page.click('input[type="submit"]');
    
    // Wait for navigation after login
    await page.waitForLoadState('networkidle');
    
    // Add assertions to verify successful login
    // Example: Check if we're on the dashboard page
    // await expect(page.locator('.dashboard-element')).toBeVisible();
  });
}); 