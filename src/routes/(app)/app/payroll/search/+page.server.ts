import { getCampaigns } from '$lib/drizzle/mysql/models/campaigns';
import { getEmployees } from '$lib/drizzle/mysql/models/employees';
import { getPayrollCycles } from '$lib/drizzle/mysql/models/payroll-cycles';
import { getPaystubs } from '$lib/drizzle/mysql/models/paystubs.js';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import { formatDate } from '$lib/utils';
import { error } from '@sveltejs/kit';
import dayjs from 'dayjs';


export const load = async ({ locals }) => {
  const session = await locals.auth.validate();
  
  if (!session) error(401, 'Unauthorized');
  
  const profile = await getUserProfileData(session?.user.userId);
  
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
    const session = await locals.auth.validate();
    
    if (!session) error(401, 'Unauthorized');
    
    const profile = await getUserProfileData(session?.user.userId);
    
    if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) error(403, 'Forbidden');
    
    const clientId = profile?.clientId || '';
    const payload = await request.formData();
    const data = Object.fromEntries(payload.entries());
    const { employeeId: rawEeId, startDate: startDateStr, endDate: endDateStr, campaignId: rawCampaignId } = data;
    const startDate = dayjs(startDateStr as string, 'YYYY-MM-DD').unix();
    const endDate = dayjs(endDateStr as string, 'YYYY-MM-DD').unix();
    const employeeId = rawEeId as string;
    const campaignId = rawCampaignId as string;
    
    const paystubs = async () => getPaystubs(clientId, startDate, endDate, employeeId, campaignId);
    
    return { 
      paystubs: await paystubs(),
    };
  }
}