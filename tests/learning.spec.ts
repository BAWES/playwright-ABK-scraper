import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  // Basic navigation test
  await page.goto('https://linear.app');
//   await page.waitForLoadState('networkidle');
  
  // Verify page title
  const title = await page.title();
  expect(title).toContain('Linear');

  // Click the contact link
  await page.getByRole('link', { name: 'Contact' }).click();
  await page.waitForLoadState('networkidle');

});

test('test league of legends', async ({ page }) => {
  await page.locator('body').click();
  await page.goto('https://www.google.com/search?q=league+of+legends&oq=league+of+legends&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCDM3NzdqMGoyqAIAsAIB&sourceid=chrome&ie=UTF-8');
  await page.getByRole('link', { name: 'League of Legends Homepage' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByLabel('Blood Sweat & Tears').click();
  const page1 = await page1Promise;
  await page1.getByRole('link', { name: 'Still Here | Season 2024' }).click();
});