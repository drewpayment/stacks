import { getCampaigns } from '$lib/drizzle/postgres/models/campaigns';
import { getEmployees } from '$lib/drizzle/postgres/models/employees';
import { getPayrollCycles } from '$lib/drizzle/postgres/models/payroll-cycles';
import { attachPayrollCycleToPaystub, getPaystubs } from '$lib/drizzle/postgres/models/paystubs.js';
import { getUserProfileData } from '$lib/drizzle/postgres/models/users';
import { formatDate } from '$lib/utils/utils';
import { error, fail } from '@sveltejs/kit';
import dayjs from 'dayjs';


export const load = async ({ locals }) => {
  if (!locals.user) return fail(401, { message: 'Unauthorized' });
  
  const profile = await getUserProfileData(locals.user.id);
  
  if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) error(403, 'Forbidden');
  
  const campaigns = async () => {
    const camps = await getCampaigns(profile?.clientId || '');
    return [{
      name: 'All Campaigns',
      value: '',
    }, ...camps.map(cc => ({
      name: cc.name,
      value: cc.id,
    }))];
  };
  const employees = async () => {
    const emps = await getEmployees(profile?.clientId || '');
    return [{
      name: 'All Employees',
      value: '',
    }, ...emps.map(ee => ({
      name: `${ee.firstName} ${ee.lastName}`,
      value: ee.id,
    }))];
  };
  const payrollCycles = async () => {
    const cycles = await getPayrollCycles(profile?.clientId || '', false);
    return cycles.map(cc => ({
      name: `${formatDate(cc.startDate)} - ${formatDate(cc.endDate)}`,
      value: cc.id,
    }));
  }
  
  const startDate = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
  const endDate = dayjs().format('YYYY-MM-DD');
  
  return {
    campaigns: await campaigns(),
    employees: await employees(),
    startDate, 
    endDate,
    cycles: await payrollCycles(),
  };
}

export const actions = {
  'search': async ({ locals, request }) => {
    if (!locals.user) return fail(401, { message: 'Unauthorized' });
    
    const profile = await getUserProfileData(locals.user.id);
    
    if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) error(403, 'Forbidden');
    
    const clientId = profile?.clientId || '';
    const payload = await request.formData();
    const data = Object.fromEntries(payload.entries());
    const { employeeId: rawEeId, startDate: startDateStr, endDate: endDateStr, campaignId: rawCampaignId, filterPayrollCycles: rawFilterCycles } = data;
    const startDate = dayjs(startDateStr as string, 'YYYY-MM-DD').unix();
    const endDate = dayjs(endDateStr as string, 'YYYY-MM-DD').unix();
    const employeeId = rawEeId as string;
    const campaignId = rawCampaignId as string;
    const filterPayrollCycles = (rawFilterCycles as string).trim().toLowerCase() === 'true';
    
    const paystubs = async () => getPaystubs(clientId, startDate, endDate, employeeId, campaignId, filterPayrollCycles);
    
    return { 
      paystubs: await paystubs(),
    };
  },
  'add-to-cycle': async ({ locals, request }) => {
    if (!locals.user) return fail(401, { message: 'Unauthorized' });
    
    const profile = await getUserProfileData(locals.user.id);
    
    if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) error(403, 'Forbidden');
    
    const payload = await request.formData();
    const data = Object.fromEntries(payload.entries());
    const { payrollCycleId: rawCycleId, paystubId: rawPaystubId } = data;
    
    const cycleId = rawCycleId as string;
    const paystubId = rawPaystubId as string;
    
    const updated = await attachPayrollCycleToPaystub(paystubId, cycleId);
    
    return updated;
  },
}