import { createEmployee, searchEmployees } from '$lib/drizzle/postgres/models/employees';
import type { Employee, InsertEmployee, InsertEmployeeProfile } from '$lib/drizzle/postgres/db.model';
import { fail } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import { searchLegacyEmployees } from '$lib/drizzle/mysql/models/employees';
import type { CombinedEmployeeResult } from '$lib/types/combined-employee-result.model.js';


export const load = async ({ locals, request, url }) => {
  if (!locals.user) return fail(401, { message: 'Unauthorized' });
  const clientId = locals.user?.profile?.clientId;
  
  if (!clientId) return {};
  
  const searchParams = url.searchParams;
  const search = searchParams.get('search') || undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '16');
  
  return {
    employees: await getPaginatedEmployees(clientId, search, page, limit),
    params: {
      search, 
      page, 
      limit,
    },
  }
}

export const actions = {
  add: async ({ locals, request }) => {
    if (!locals.user) return fail(401, { message: 'Unauthorized' });
    
    const profile = locals.user.profile;
    const payload = await request.formData();
    const data = Object.fromEntries(payload.entries());
    const now = dayjs().toDate();
    
    const insertEmployee: InsertEmployee = {
      id: nanoid(),
      firstName: data.first_name as string,
      lastName: data.last_name as string,
      clientId: profile.clientId as string,
      userId: data.user_id as string,
      created: now,
      updated: now,
    };
    
    const insertEmployeeProfile: InsertEmployeeProfile = {
      id: nanoid(),
      employeeId: insertEmployee.id,
      address: data.address as string,
      address2: data.address_2 as string,
      city: data.city as string,
      state: data.state as string,
      zip: data.zip as string,
      phone: data.phone as string,
      phone2: data.phone_2 as string,
      email: data.email as string,
    };
    
    try {
      await createEmployee(insertEmployee, insertEmployeeProfile);
    } catch (err) {
      console.error(err);
      return { status: 500 };
    }
    
    return data;
  },
  search: async ({ locals, url, request }) => {
    if (!locals.user || !locals.user.profile) return fail(401, { message: 'Unauthorized' });
    
    const clientId = locals.user.profile.clientId;
    
    if (!clientId) return {};
    
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    
    const page = parseInt(data.page as string);
    const limit = parseInt(data.limit as string);
    const search = data.search as string;
    
    if (page == null || limit == null) return fail(400, { message: 'Invalid request' });
    
    return {
      employees: await getPaginatedEmployees(clientId, search, page, limit),
      params: {
        search, 
        page, 
        limit,
      },
    }
  }
}

const getPaginatedEmployees = async (clientId: string, search: string | undefined, page: number, limit: number) => {
  const employees = async (): Promise<Employee[]> => await searchEmployees(clientId as string, page, limit, search);
  
  const loadData = async (): Promise<CombinedEmployeeResult[]> => {
    const ees = await employees();
    const legacyEmployees = await searchLegacyEmployees(page, limit, search);
    const filterLegacyEmps = legacyEmployees.filter(le => le.email && !ees.find(ee => ee.employeeProfile.email === le.email)).map(le => ({ ...le, legacy: true }));
    
    return [...ees, ...filterLegacyEmps] as CombinedEmployeeResult[];
  }
  
  return await loadData();
}