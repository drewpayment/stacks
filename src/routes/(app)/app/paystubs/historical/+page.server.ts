import { searchPaystubs } from '$lib/drizzle/mysql/models/paystubs';
import dayjs from 'dayjs';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { getVendors } from '$lib/drizzle/mysql/models/vendors';
import { getLegacyEmployees } from '$lib/drizzle/mysql/models/employees';
import type { SelectLegacyPaystub } from '$lib/drizzle/mysql/db.model';


export const load = async ({ locals, url }) => {
  if (!locals.user) return fail(401, { message: 'Unauthorized' });
  const role = locals.user.profile?.role;
  
  if (!role || !['super_admin', 'admin'].includes(role)) redirect(302, '/');
  
  const params = url.searchParams;
  let startDate = dayjs(params.get('startDate'));
  let endDate = dayjs(params.get('endDate'));
  let employeeId = Number(params.get('employeeId'));
  let vendorId = Number(params.get('campaignId'));
  
  if (!startDate.isValid()) startDate = dayjs().subtract(1, 'week');
  if (!endDate.isValid()) endDate = dayjs();
  
  if (isNaN(employeeId)) employeeId = -1;
  if (isNaN(vendorId)) vendorId = -1;
  
  const getPaystubs = async () => {
    const res = await searchPaystubs(startDate, endDate, vendorId, employeeId);
    return [...res.map(p => ({...p}))];
  };
  
  const campaigns = async () => {
    const camps = await getVendors();
    return [{
      name: 'All Campaigns',
      value: '-1',
    }, ...camps.map(cc => ({
      name: cc.name,
      value: cc.id,
    }))];
  }
  
  const employees = async () => {
    const emps = await getLegacyEmployees();
    return [{
      name: 'All Employees',
      value: '-1',
    }, ...emps.map(ee => ({
      name: `${ee.name}`,
      value: ee.id,
    }))];
  }
  
  return {
    paystubs: await getPaystubs(),
    campaigns: await campaigns(),
    employees: await employees(),
    startDate: startDate.format('YYYY-MM-DD'),
    endDate: endDate.format('YYYY-MM-DD'),
  };
};

export const actions: Actions = {
  search: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { message: 'Unauthorized' });
    
    const data = await request.formData();
    const startDate = dayjs(data.get('startDate') as string, 'YYYY-MM-DD');
    const endDate = dayjs(data.get('endDate') as string, 'YYYY-MM-DD');
    const employeeId = Number(data.get('employeeId'));
    const vendorId = Number(data.get('campaignId'));
    
    console.log(`EMPLOYEE ID: ${employeeId}`)
    
    const paystubs = await getPaystubs(startDate, endDate, vendorId, employeeId);
    
    return {
      paystubs,
    };
  }
};

const getPaystubs = async (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs, vendorId: number, employeeId: number): Promise<SelectLegacyPaystub[]> => {
  if (!startDate.isValid()) startDate = dayjs().subtract(1, 'week');
  if (!endDate.isValid()) endDate = dayjs();
  
  if (isNaN(employeeId) || employeeId === 0) employeeId = -1;
  if (isNaN(vendorId) || vendorId === 0) vendorId = -1;
  
  console.log(vendorId, employeeId)
  
  return searchPaystubs(startDate, endDate, vendorId, employeeId);
}