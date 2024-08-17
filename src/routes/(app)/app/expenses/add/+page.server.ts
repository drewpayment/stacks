import { fail, redirect } from '@sveltejs/kit';
import type { SelectOptionType } from 'flowbite-svelte';
import { drizzleClient as db } from '$lib/drizzle/postgres/client';

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
    
    const data = Object.fromEntries(await request.formData());
    const report = JSON.parse(data.report as string);
    
    // const keys = Object.keys(data.report)
    
    console.log(data.report)
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