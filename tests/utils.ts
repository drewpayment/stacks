import { type Page, expect } from '@playwright/test';


class TestHelpers {
  
  async login({ page }: { page: Page }) {
    await page.goto('/auth/login');
    await page.getByPlaceholder('Your email address').click();
    await page.getByPlaceholder('Your email address').fill('drew.payment@gmail.com');
    await page.getByPlaceholder('Your password').click();
    await page.getByPlaceholder('Your password').fill('Password1');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await expect(page.getByRole('heading', { name: 'Welcome, Drew Payment.' })).toBeVisible();
  }
  
}

export default new TestHelpers();