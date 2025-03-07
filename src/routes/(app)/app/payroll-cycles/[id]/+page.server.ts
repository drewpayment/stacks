import { getPayrollCycle, togglePayrollCycleClose } from '$lib/drizzle/postgres/models/payroll-cycles.js';
import { attachPayrollCycleToPaystub, getPaystubsByPayrollCycleId, getPaystubsWoPayrollCycle } from '$lib/drizzle/postgres/models/paystubs.js';
import { getUserProfileData } from '$lib/drizzle/postgres/models/users';
import type { SelectPayrollCycle } from '$lib/drizzle/postgres/db.model.js';
import type { CycleAndPaystubs, PaystubWith } from '$lib/drizzle/postgres/types/paystbus.model';
import { fail, type Actions } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { dev } from '$app/environment';

export const load = async ({ locals, params }) => {
  if (!locals.user) return fail(401, { message: 'Unauthorized' });
  
  const profile = locals.user.profile;
  
  const getData = async (): Promise<CycleAndPaystubs> => {  
    if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) return {
      cycle: null as unknown as SelectPayrollCycle,
      paystubs: [] as PaystubWith[],
      canOpen: false,
    };
    
    const cycle = await getPayrollCycle(params.id);
    
    if (profile.clientId !== cycle?.clientId) return {
      cycle: null as unknown as SelectPayrollCycle,
      paystubs: [] as PaystubWith[],
      canOpen: false,
    }
    
    const paymentDayjs = dayjs(cycle.paymentDate, 'YYYY-MM-DD HH:mm:ss');
    const today = dayjs();
    const canOpen = cycle.isClosed && paymentDayjs.isAfter(today);
    
    // const paystubs = await getPaystubs(profile?.clientId, cycle?.startDate as any, cycle?.endDate as any);
    const relatedPaystubs = await getPaystubsByPayrollCycleId(profile?.clientId, cycle.id);
    
    let paystubs: PaystubWith[];
    if (canOpen || !cycle.isClosed) {
      const unattachedPaystubs = await getPaystubsWoPayrollCycle(profile?.clientId, cycle?.startDate, cycle?.endDate);
      
      paystubs = [...relatedPaystubs, ...unattachedPaystubs];
    } else {
      paystubs = relatedPaystubs;
    }
    
    return { cycle, paystubs, canOpen };
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
    
    const profile = locals.user.profile;
    
    const formData = await request.formData();
    const data = Object.fromEntries(formData) as unknown as {
      id: string;
      isClosed: string;
    };
    
    if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) return { status: 403 };
    
    // let's toggle the value we are going to save 
    const isClosed = !(data.isClosed === 'true');
    
    const result = await togglePayrollCycleClose(data.id, isClosed);
    
    return result ? { status: 200 } : { status: 400 };
  },
};