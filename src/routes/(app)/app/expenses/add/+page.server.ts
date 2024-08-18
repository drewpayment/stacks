import { fail, redirect } from '@sveltejs/kit';
import type { SelectOptionType } from 'flowbite-svelte';
import { drizzleClient as db } from '$lib/drizzle/postgres/client';
import type { InsertExpenseReport, InsertExpenseItem } from '$lib/drizzle/postgres/db.model';
import { nanoid } from 'nanoid';
import { expenseItem, expenseReport } from '$lib/drizzle/postgres/schema.js';
import dayjs from 'dayjs';

export const load = async ({ locals }) => {
  if (!locals.user) return redirect(302, '/login');
  if (!['super_admin', 'admin', 'org_admin'].includes(locals.user.profile.role)) {
    // user is not permitted to use this page. 
    return redirect(302, '/');
  }
  
  const clientId = locals.user.profile.clientId;
  
  if (!clientId) return redirect(302, '/');
  
  return {
    employees: await getEmployeeOptions(clientId),
  };
};

export const actions = {
  save: async ({ locals, request }) => {
    if (!locals.user) return fail(401, { message: 'You must be logged in to do that.' });
    const clientId = locals.user.profile.clientId;
    
    if (!clientId) return fail(403, { message: 'You are not permitted to do that.' });
    
    const data = Object.fromEntries(await request.formData());
    const report = JSON.parse(data.report as string) as InsertExpenseReport & { items: InsertExpenseItem[] };
    
    try {
      let reportTotal = 0;
      
      report.id = nanoid();
      report.clientId = clientId;
      report.items.forEach((item) => {
        item.clientId = clientId;
        item.exportReportId = report.id;
        item.date = dayjs(item.date).toDate();
        
        reportTotal += Number(item.amount);
      });
      
      // separate the expense items from the expense report to 2 separate inserts.
      const { items, ...reportData } = report;
      
      if (reportTotal !== Number(report.totalAmount)) {
        report.totalAmount = `${reportTotal}`;
      }
      
      reportData.submissionDate = dayjs(report.submissionDate).toDate();
      const now = dayjs().toDate();
      reportData.created = now;
      reportData.updated = now;
      
      await db.transaction(async (tx) => {
        await tx.insert(expenseReport).values(reportData);
        await tx.insert(expenseItem).values(items);
      });
    } catch (err) {
      console.error(err);
      return fail(500, { message: 'An error occurred while saving the expense report.' });
    }
  },
};

const getEmployeeOptions = async (clientId: string): Promise<SelectOptionType<string>[]> => {
  let employees: SelectOptionType<string>[] = [];
  
  try {
    employees = (await db.query.employee
      .findMany({
        columns: {
          id: true,
          firstName: true,
          lastName: true,
        },
        where: (employee, { eq }) => eq(employee.clientId, clientId),
        orderBy: (employee, { asc }) => [asc(employee.lastName), asc(employee.firstName)],
      }))
      .map((ee) => ({
        value: ee.id,
        name: `${ee.firstName} ${ee.lastName}`,
      }));
  } catch (err) {
    console.error(err);
  }
  
  return employees;
}