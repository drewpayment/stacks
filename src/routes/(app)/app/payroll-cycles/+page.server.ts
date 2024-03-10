import { getPayrollCycles } from '$lib/drizzle/mysql/models/payroll-cycles';
import { numberOfPaystubsByPayrollCycleId } from '$lib/drizzle/mysql/models/paystubs.js';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import type { SelectPayrollCycle } from '$lib/types/db.model.js';
import { fail } from '@sveltejs/kit';


export const load = async ({ locals }) => {
  if (!locals.user) return fail(401, { message: 'Unauthorized' });
  
  const payrollCycles = async (): Promise<(SelectPayrollCycle & { paystubCount: number })[]> => {
    const profile = await getUserProfileData(locals.user?.id);
    
    if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) return [];
    
    const payrollCycles = await getPayrollCycles(profile?.clientId as string);
    
    const payrollCyclesWithPaystubCount = payrollCycles.map(async (pc) => {
      const count = await numberOfPaystubsByPayrollCycleId(pc.id);
      
      return {
        ...pc,
        paystubCount: count,
      };
    });
    
    return await Promise.all(payrollCyclesWithPaystubCount);
  }
  
  return {
    payrollCycles: await payrollCycles(),
  };
}