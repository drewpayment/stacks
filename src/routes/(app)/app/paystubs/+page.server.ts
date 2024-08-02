import { getEmployeeByUserId } from '$lib/drizzle/postgres/models/employees';
import { getPaystubs } from '$lib/drizzle/postgres/models/paystubs.js';
import { getUserProfileData } from '$lib/drizzle/postgres/models/users';
import type { PaystubWith } from '$lib/drizzle/postgres/types/paystbus.model';
import { error, fail } from '@sveltejs/kit';
import dayjs from 'dayjs';

export const load = async ({ locals }) => {
  if (!locals.user) return fail(401, { message: 'Unauthorized' });
  
  const profile = await getUserProfileData(locals.user.id);
  
  if (!profile) error(403, 'Forbidden');
  
  const clientId = profile?.clientId || '';
  const startDate = dayjs().subtract(1, 'year');
  const endDate = dayjs();
  
  const paystubs = async () => {
    const employee = await getEmployeeByUserId(locals.user?.id as string);
    
    if (!employee) return [] as PaystubWith[];
    
    const stubs = await getPaystubs(clientId, startDate.unix(), endDate.unix(), employee?.id);
    return stubs.filter(x => !!x.payrollCycleId);
  };
  
  return {
    startDate: startDate.format('YYYY-MM-DD'),
    endDate: endDate.format('YYYY-MM-DD'),
    paystubs: await paystubs(),
  };
}