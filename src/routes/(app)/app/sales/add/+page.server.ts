import { getCampaigns } from '$lib/drizzle/postgres/models/campaigns';
import { getEmployees } from '$lib/drizzle/postgres/models/employees.js';
import { saveSale, toClientDto, toInsertSale } from '$lib/drizzle/postgres/models/sales';
import { getUserProfileData } from '$lib/drizzle/postgres/models/users';
import type { SaleDto } from '$lib/drizzle/postgres/db.model.js';
import { fail, redirect, type Actions } from '@sveltejs/kit';


export const load = async ({ locals, request, url }) => {
	if (!locals.user) return fail(401, { message: 'Unauthorized' });
	const profile = locals.user.profile;
  
  if (!profile?.clientId) redirect(302, '/');
  if (!['org_admin', 'super_admin'].includes(profile?.role)) redirect(302, '/');
  
  const clientId = profile.clientId;
  const employeeId = url.searchParams.get('employee');
  const campaignId = url.searchParams.get('campaign');
  
  const campaigns = async () => {
    const campaigns = await getCampaigns(clientId);
    
    return campaigns.map(c => ({
      name: c.name,
      value: c.id,
    }));
  };
  
  const employees = async () => {
    const employees = await getEmployees(clientId, true);
    
    return employees.map(e => ({
      name: `${e.firstName} ${e.lastName}`,
      value: e.id,
    }));
  }

	return {
		campaigns: await campaigns(),
    employees: await employees(),
    employeeId,
    campaignId,
	};
};

const cleanCurrency = (value: string | null | undefined): number => {
  return value != null ? value.replace(/[^0-9.-]+/g, '') as unknown as number : 0;
}

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { message: 'Unauthorized' });
    
    const profile = await getUserProfileData(locals.user.id);
    
    if (!profile?.clientId) return { status: 401 };
    if (!['org_admin', 'super_admin'].includes(profile?.role)) return { status: 401 };
    
    const data = Object.fromEntries(await request.formData());
    
    data.sale_amount = cleanCurrency(`${data.sale_amount}`) as any;
    data.is_complete = (data.status_description === 'approved' ? 1 : 0) as any;
    data.client_id = profile.clientId;
    
    // todo: MISSING EMPLOYEE ID
    const dto = toInsertSale(data);
    let result = null as unknown as SaleDto;
    
    try {
      const res = await saveSale(dto);
      result = toClientDto(res);
    } catch (ex) {
      console.error(ex);
      return { status: 500 };
    }
    
    return {
      status: 200,
      body: result,
    };
  }
};