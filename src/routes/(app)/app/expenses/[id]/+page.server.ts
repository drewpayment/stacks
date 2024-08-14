import { getExpenseReport } from '$lib/drizzle/postgres/models/expenses.js';
import { fail } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
  const { id: expenseReportId } = params;
  
  if (!locals.user) fail(401, { message: 'Unauthorized' });
  
  const clientId = locals.user.profile.clientId as string;
  
  const getReport = async () => await getExpenseReport(clientId, expenseReportId);
  
  return {
    report: await getReport(),
  };
};