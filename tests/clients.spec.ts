import { test, expect } from '@playwright/test';
import utils from './utils';

test.describe('Admin client management tests', () => {
  
  test.beforeEach(utils.login);
  
  test('Navigate to clients', async ({ page }) => {
    await page.goto('/app/client');
    
    await expect(page.getByRole('heading', { name: 'Manage Clients' })).toBeInViewport();
  });
  
  test('Add client', async ({ page }) => {
    await page.goto('/app/client');
    
    await page.getByLabel('Add client toggle').click();
    
    await page.getByRole('textbox', { name: 'name' }).fill('TEST CLIENT');
    
    await expect(page.getByRole('textbox', { name: 'name' })).toHaveValue('TEST CLIENT');
    
    const saveButton = await page.getByRole('button', { name: 'save' });
    
    await expect(saveButton).toBeVisible();
    
    await saveButton.click();
    
    await expect(page.getByText('TEST CLIENT')).toBeVisible();
  });  
  
});
