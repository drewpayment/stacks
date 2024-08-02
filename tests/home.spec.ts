import { test, expect } from '@playwright/test';

test('Navigate to home', async ({ page }) => {
  await page.goto('/');
  
  await expect(page).toHaveURL('/');
});