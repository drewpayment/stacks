import { test, expect } from '@playwright/test';
import utils from './utils';
import dayjs from 'dayjs';
import { drizzleClient as db } from '$lib/drizzle/postgres/client';
import { employee } from '$lib/drizzle/postgres/schema';
import { eq } from 'drizzle-orm';

test.describe('My Test Suite', () => {
  
  test.beforeEach(utils.login);
  
  test('Add Employee', async ({ page }) => {
    
    await page.goto('/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByPlaceholder('Your email address').click();
    await page.getByPlaceholder('Your email address').fill('drew.payment@gmail.com');
    await page.getByPlaceholder('Your email address').press('Tab');
    await page.getByPlaceholder('Your password').fill('Password1');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'Employee' }).click();
    await page.getByRole('button', { name: 'Employees chevron right solid' }).click();
    await page.getByRole('link', { name: 'View' }).click();
    await page.getByRole('button', { name: 'Add Employee' }).click();
    await page.getByLabel('First Name').click();
    await page.getByLabel('First Name').fill('Test');
    await page.getByLabel('First Name').press('Tab');
    await page.getByLabel('Last Name').fill('Employee');
    await page.getByLabel('Last Name').press('Tab');
    await page.getByLabel('Phone').fill('6165152345');
    await page.getByLabel('Phone').press('Tab');
    await page.getByLabel('Email').fill('testemployee@test.com');
    await page.getByLabel('Email').press('Tab');
    await page.getByLabel('Address').fill('1616 Pennsylvania Ave');
    await page.getByLabel('Address').press('Tab');
    await page.getByLabel('Apt / Unit').press('Tab');
    await page.getByLabel('City').fill('Washington');
    await page.getByLabel('City').press('Tab');
    await page.getByLabel('State').fill('DC');
    await page.getByLabel('State').press('Tab');
    await page.getByLabel('Zip').fill('01920');
    await page.getByRole('button', { name: 'Save' }).click();
    
    await expect(page.getByRole('heading', { name: 'Test Employee' })).toBeVisible();
    
  });
  
  test('Add Employee Note', async ({ page }) => {
    
    await page.goto('/app/employee');
    await page.getByText('TE Test Employee testemployee').getByRole('link').click();
    await page.getByPlaceholder('Write a comment').click();
    await page.getByPlaceholder('Write a comment').fill('This is just a test note from Playwright.');
    await page.getByRole('button', { name: 'Add Note' }).click();
    
    const today = dayjs().format('MMMM D, YYYY');
    await expect(page.getByText(`${today}`)).toBeVisible();
    
  });
  
  test('Edit Employee', async ({ page }) => {
    
    await page.goto('/app/employee');
    await page.getByText('TE Test Employee testemployee').getByRole('link').click();
    await page.locator('#phone').click();
    await page.locator('#phone').press('Shift+Home');
    await page.locator('#phone').fill('1234567890');
    await page.getByLabel('Address').click();
    await page.getByLabel('Address').press('Shift+Home');
    await page.getByLabel('Address').fill('1234 D Ave');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.goto('/app/employee');
    await page.getByText('TE Test Employee testemployee').getByRole('link').click();
    
    await expect(page.locator('#phone')).toHaveValue('(123) 456-7890');
    
  });
  
  test('Delete Employee', async ({ page }) => {
    
    await page.goto('/app/employee');
    await page.getByText('TE Test Employee testemployee').getByRole('link').click();
    const url = new URL(page.url());
    const pathParts = url.pathname.split('/');
    const employeeId = pathParts[pathParts.length - 1];
    
    try {
      await db.delete(employee)
        .where(eq(employee.id, employeeId));
    } catch (err) {
      console.error('Error deleting employee: ', err);
      test.fail(true, "Failed to delete employee.");
    }
    
    await expect(page.getByText('TE Test Employee testemployee')).not.toBeVisible();
  });
  
});
