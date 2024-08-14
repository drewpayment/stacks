import { getExpenseReports } from '$lib/drizzle/postgres/models/expenses.js';
import { type Actions, fail } from '@sveltejs/kit';


export const load = async ({ locals }) => {
  if (!locals.user) fail(401, { message: 'Unauthorized' });
  
  const clientId = locals.user.profile.clientId as string;
  
  const getReports = async () => await getExpenseReports(clientId);
  
  return {
    reports: await getReports(),
  };
};

export const actions: Actions = {
  
};