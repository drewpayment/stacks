import { getCampaigns } from '$lib/drizzle/mysql/models/campaigns';
import { getEmployees } from '$lib/drizzle/mysql/models/employees';
import { getSales } from '$lib/drizzle/mysql/models/sales';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import type { SaleWithEmployee } from '$lib/types/sale.model';
import { redirect, type Actions, error } from '@sveltejs/kit';
import dayjs from 'dayjs';

const searchSales = async (clientId: string, startDate: number, endDate: number) => {
  const withStmt = {
    employee: {
      columns: {
        id: true,
        firstName: true,
        lastName: true,
      },
    },
    campaign: {
      columns: {
        id: true,
        name: true,
      },
    },
  };
  
  const res = await getSales<SaleWithEmployee>(clientId, startDate, endDate, withStmt);
  
  return structuredClone(res);
}

export const load = async ({ locals, request }) => {
  const session = await locals.auth.validate();
	const profile = await getUserProfileData(session?.user.userId);
  
  if (!session || !profile?.clientId) redirect(302, '/');
  if (!['org_admin', 'super_admin'].includes(profile?.role)) redirect(302, '/');
  
  const clientId = profile?.clientId as string;
  
  const startDate = dayjs().subtract(1, 'month');
  const endDate = dayjs();
  
  const sales = async () => await searchSales(clientId, startDate.unix(), endDate.unix());
  
  return {
    sales: await sales(),
    startDate: startDate.format('YYYY-MM-DD'),
    endDate: endDate.format('YYYY-MM-DD'),
    campaigns: await getCampaigns(clientId),
    employees: await getEmployees(clientId, true),
  }
};

export const actions: Actions = {
  search: async ({ locals, request }) => {
    const session = await locals.auth.validate();
    const profile = await getUserProfileData(session?.user.userId);
    
    if (!session || !profile?.clientId) error(401, 'Unauthorized');
    if (!['org_admin', 'super_admin'].includes(profile?.role)) error(401, 'Unauthorized');
    
    const clientId = profile?.clientId as string;
    const formData = Object.fromEntries(await request.formData());
    
    const startDate = dayjs(formData.startDate as string, 'YYYY-MM-DD').unix();
    const endDate = dayjs(formData.endDate as string, 'YYYY-MM-DD').unix();
    
    const sales = async () => {
      const result = await searchSales(clientId, startDate, endDate);
      
      console.log(result);
      
      return result;
    };
    
    return {
      sales: await sales(),
      startDate,
      endDate,
      campaigns: await getCampaigns(clientId),
      employees: await getEmployees(clientId, true),
    }
  },
};