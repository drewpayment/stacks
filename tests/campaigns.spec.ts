import {expect, test} from '@playwright/test';
import utils from './utils';

test.describe('Admin campaign management', () => {
  
  test.beforeEach(utils.login);
  
  test('Navigate to Campaigns', async ({ page }) => {
    await page.goto('/app/campaigns');
    
    await expect(page.getByRole('heading', { name: 'Campaigns' })).toBeVisible();
  });
  
  test('Add a new campaign', async ({ page }) => {
    
    await page.goto('/app/campaigns/add');
    await page.getByLabel('Name').click();
    await page.getByLabel('Name').press('CapsLock');
    await page.getByLabel('Name').fill('TEST CAMPAIGN');
    await page.getByLabel('URL').click();
    await page.getByLabel('URL').fill('https://testcampaign.test');
    await page.getByLabel('Description').click();
    await page.getByLabel('Description').fill('This is just a test.');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('link', { name: 'Campaigns' }).click();
    await page.goto('/app/campaigns');
    
    await expect(page.getByText('TEST CAMPAIGN')).toBeVisible();    
  });
  
  test('Edit a campaign', async ({ page }) => {
    const randomNumber = Math.floor(Math.random() * 900) + 100;
    
    await page.goto('/app/campaigns');
    await page.getByRole('row', { name: 'TEST CAMPAIGN https://' }).getByRole('button').click();
    await page.getByRole('menuitem', { name: 'Edit' }).nth(1).click();
    
    await expect(page.getByRole('heading', { name: 'TEST CAMPAIGN' })).toBeVisible();
    
    await page.getByLabel('Description').click();
    await page.getByLabel('Description').fill('This is an updated description! # ' + randomNumber);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.goto('/app/campaigns');
    
    await expect(page.locator('tbody')).toContainText('This is an updated description! # ' + randomNumber);
  });
  
})