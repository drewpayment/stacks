import { createEmployee, getEmployees } from '$lib/drizzle/postgres/models/employees';
import { getUserProfileData } from '$lib/drizzle/postgres/models/users';
import type { Employee, InsertEmployee, InsertEmployeeProfile } from '$lib/drizzle/postgres/db.model';
import { fail } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import { getLegacyEmployees } from '$lib/drizzle/mysql/models/employees';
import type { SelectLegacyEmployee } from '$lib/drizzle/mysql/db.model.js';


export const load = async ({locals}) => {
  if (!locals.user) return fail(401, { message: 'Unauthorized' });
  
  const employees = async (): Promise<Employee[]> => {
    const up = await getUserProfileData(locals.user?.id);
    
    if (!up) return [];
    
    return await getEmployees(up?.clientId as string);
  }
  
  const loadData = async (): Promise<{ employees: Employee[]; legacyEmployees: SelectLegacyEmployee[] }> => {
    const ees = await employees();
    const legacyEmployees = await getLegacyEmployees();
    const filterLegacyEmps = legacyEmployees.filter(le => le.email && !ees.find(ee => ee.employeeProfile.email === le.email));
    
    return {
      employees: ees,
      legacyEmployees: filterLegacyEmps,
    };
  }
  
  return await loadData();
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
  }
}