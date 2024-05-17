import { getPayrollCycle, togglePayrollCycleClose } from '$lib/drizzle/postgres/models/payroll-cycles.js';
import { attachPayrollCycleToPaystub, getPaystubs, getPaystubsByPayrollCycleId, getPaystubsWoPayrollCycle } from '$lib/drizzle/postgres/models/paystubs.js';
import { getUserProfileData } from '$lib/drizzle/postgres/models/users';
import type { SelectPayrollCycle } from '$lib/drizzle/postgres/db.model.js';
import type { CycleAndPaystubs, PaystubWith } from '$lib/drizzle/postgres/types/paystbus.model';
import { fail, type Actions } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
  if (!locals.user) return fail(401, { message: 'Unauthorized' });
  
  const profile = await getUserProfileData(locals.user.id);
  
  const getData = async (): Promise<CycleAndPaystubs> => {  
    if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) return {
      cycle: null as unknown as SelectPayrollCycle,
      paystubs: [] as PaystubWith[],
    };
    
    const cycle = await getPayrollCycle(params.id);
    
    if (profile.clientId !== cycle?.clientId) return {
      cycle: null as unknown as SelectPayrollCycle,
      paystubs: [] as PaystubWith[],
    }
    
    const unattachedPaystubs = await getPaystubsWoPayrollCycle(profile?.clientId, cycle?.startDate as any, cycle?.endDate as any);
    // const paystubs = await getPaystubs(profile?.clientId, cycle?.startDate as any, cycle?.endDate as any);
    const relatedPaystubs = await getPaystubsByPayrollCycleId(profile?.clientId, cycle.id);
    
    const paystubs = [...relatedPaystubs, ...unattachedPaystubs];
    
    return { cycle, paystubs };
  }
  
  return {
    cycleAndPaystubs: await getData(),
  };
};

export const actions: Actions = {
  'attach-payroll-cycle': async ({ request, locals, params }) => {
    if (!locals.user) return fail(401, { message: 'Unauthorized' });
    
    const profile = await getUserProfileData(locals.user.id);
    
    const formData = await request.formData();
    const data = Object.fromEntries(formData) as {
      paystubId: string;
      payrollCycleId: string;
    }
    
    if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) return null;
    
    const result = await attachPayrollCycleToPaystub(data.paystubId, data.payrollCycleId);
    
    return result;
  },
  'toggle-payroll-cycle-close': async ({ request, locals, params }) => {
    if (!locals.user) return fail(401, { message: 'Unauthorized' });
    
    const profile = await getUserProfileData(locals.user.id);
    
    const formData = await request.formData();
    const data = Object.fromEntries(formData) as unknown as {
      id: string;
      isClosed: string;
    };
    
    if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) return { status: 403 };
    
    const result = await togglePayrollCycleClose(data.id, data.isClosed);
    
    return result ? { status: 200 } : { status: 400 };
  },
};