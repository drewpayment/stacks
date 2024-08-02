import type { SelectEmployee, SelectPayrollCycle, SelectPaystub } from '$lib/drizzle/postgres/db.model';
import { getLastPayrollCycle } from '$lib/drizzle/postgres/models/payroll-cycles';
import { UserClient } from '$lib/drizzle/postgres/models/user-clients';
import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || !locals.user.profile) {
    return {};
  }
  
  const profile = locals.user?.profile;
  
  if (!profile || !profile.clientId) return {};
  const clientId = profile?.clientId as string;
  const userId = locals.user.id;
  
  if (!(await UserClient.canAccess(userId, clientId))) return {};
  
  // get latest payroll cycle with associated paystubs 
  const getLatestPayrollCycle = async (): Promise<SelectPayrollCycle & { paystubs: (SelectPaystub & { employee: SelectEmployee })[] }> => {
    return (await getLastPayrollCycle(clientId)) as SelectPayrollCycle & { paystubs: (SelectPaystub & { employee: SelectEmployee })[] };
  }
  
  return {
    lastPayrollCycle: await getLatestPayrollCycle(),    
  };
};