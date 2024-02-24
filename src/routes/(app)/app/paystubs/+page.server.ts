import { getEmployeeByUserId } from '$lib/drizzle/mysql/models/employees';
import { getPaystubs } from '$lib/drizzle/mysql/models/paystubs.js';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import { error } from '@sveltejs/kit';
import dayjs from 'dayjs';

export const load = async ({ locals }) => {
  const session = await locals.auth.validate();
  
  if (!session) error(401, 'Unauthorized');
  
  const profile = await getUserProfileData(session?.user.userId);
  
  if (!profile) error(403, 'Forbidden');
  
  const clientId = profile?.clientId || '';
  const startDate = dayjs().subtract(1, 'year');
  const endDate = dayjs();
  
  const paystubs = async () => {
    const employee = await getEmployeeByUserId(session?.user.userId);
    return await getPaystubs(clientId, startDate.unix(), endDate.unix(), employee?.id);
  };
  
  return {
    startDate: startDate.format('YYYY-MM-DD'),
    endDate: endDate.format('YYYY-MM-DD'),
    paystubs: await paystubs(),
  };
}