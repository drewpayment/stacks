import { getCampaigns } from '$lib/drizzle/postgres/models/campaigns.js';
import { getEmployee, getEmployees } from '$lib/drizzle/postgres/models/employees.js';
import { getPendingSaleOverrides, saveManualOverrides, createOverridesFromSalesForOverridingManagers } from '$lib/drizzle/postgres/models/overrides.js';
import { getPayrollCycles } from '$lib/drizzle/postgres/models/payroll-cycles.js';
import { generatePendingPaystub, insertPaystub } from '$lib/drizzle/postgres/models/paystubs.js';
import { getUnallocatedSalesByEmployee, saveSales, updateSelectedSalesToPaystub } from '$lib/drizzle/postgres/models/sales.js';
import { getUserProfileData } from '$lib/drizzle/postgres/models/users';
import type { Employee, SelectSale, SelectSaleOverride } from '$lib/drizzle/postgres/db.model';
import type { InsertManualOverride } from '$lib/drizzle/types/override.model.js';
import { formatDate } from '$lib/utils.js';
import { error, fail } from '@sveltejs/kit';


export const load = async ({ locals }) => {
  if (!locals.user) return fail(401, { message: 'Unauthorized' });
  
  const profile = await getUserProfileData(locals.user.id);
  
  if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) error(403, 'Forbidden');
  
  const campaigns = async () => {
    const camps = await getCampaigns(profile?.clientId || '');
    return camps.map(cc => ({
      name: cc.name,
      value: cc.id,
    }));
  };
  const employees = async () => {
    const emps = await getEmployees(profile?.clientId || '');
    return emps.map(ee => ({
      name: `${ee.firstName} ${ee.lastName}`,
      value: ee.id,
    }));
  };
  const payrollCycles = async () => {
    const cycles = await getPayrollCycles(profile?.clientId || '', false);
    return cycles.map(cc => ({
      name: `${formatDate(cc.startDate)} - ${formatDate(cc.endDate)}`,
      value: cc.id,
    }));
  }
  
  return {
    campaigns: await campaigns(),
    employees: await employees(),
    cycles: await payrollCycles(),
  };
};

export const actions = {
  'get-sales-by-employee': async ({ locals, request }) => {
    if (!locals.user) return fail(401, { message: 'Unauthorized' });
    
    const profile = await getUserProfileData(locals.user.id);
    
    if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) error(403, 'Forbidden');
    
    const payload = await request.formData();
    const data = Object.fromEntries(payload.entries());
    const { employeeId, campaignId } = data;
    
    const sales = await getUnallocatedSalesByEmployee(profile?.clientId || '', `${campaignId}`, `${employeeId}`);
    const overrides = await getPendingSaleOverrides(employeeId as string);
    
    return { sales, overrides };
  },
  'save-paystub': async ({ locals, request }) => {
    if (!locals.user) return fail(401, { message: 'Unauthorized' });
    
    const profile = await getUserProfileData(locals.user.id);
    
    if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) error(403, 'Forbidden');
    
    const payload = await request.formData();
    const { selectedSales: salesRaw, employeeId, campaignId, selectedSaleOverrides: rawOverrides, pendingManualOverrides: rawManualOverrides } = Object.fromEntries(payload.entries());
    const selectedSales = JSON.parse(salesRaw as any) as SelectSale[];
    const selectedOverrides = JSON.parse(rawOverrides as any) as SelectSaleOverride[];
    const pendingManualOverrides = JSON.parse(rawManualOverrides as any) as InsertManualOverride[];
    const clientId = profile?.clientId || '';
    
    if (!clientId || !employeeId || !campaignId || !selectedSales?.length) error(400, 'Bad Request');
    
    const pendingPaystub = generatePendingPaystub(clientId, employeeId as string, campaignId as string);
    
    pendingPaystub.totalSales = selectedSales.length;
    
    const employee = await getEmployee(employeeId as string, false, false, false, true) as unknown as Employee;
    const { overrideTo } = employee;
    
    // employee has a default override manager selected, so let's create override records for each sale that has been 
    // saved to this paystub. 
    if (overrideTo) {
      // todo: how do i save pending overrides without overlapping with the selected overrides? 
      // save sale overrides based on the default agent rule
      const overridesSaved = await createOverridesFromSalesForOverridingManagers(selectedSales);
      if (!overridesSaved.success) {
        console.error('Error saving sale overrides');
        error(500, 'Error saving sale overrides');
      }
      
      const manualOverridesSaved = await saveManualOverrides(clientId, pendingPaystub.id, pendingManualOverrides);
      if (!manualOverridesSaved.success) {
        console.error('Error saving manual overrides');
        error(500, 'Error saving manual overrides');
      }
      
      pendingPaystub.grossPay += (selectedOverrides.reduce((c, v) => c + v.overrideAmount, 0) + manualOverridesSaved.total);
      pendingPaystub.totalOverrides = selectedOverrides.length + pendingManualOverrides.length;
    } 
    
    const getSaleAmount = (sale: SelectSale) => {
      const saleDesc = sale.statusDescription.toLowerCase().trim();
      if (saleDesc === 'pending') return 0;
      if (saleDesc === 'rejected') return sale.saleAmount;
      if (saleDesc === 'approved') return sale.saleAmount;
      return 0;
    }
    
    pendingPaystub.totalSales = selectedSales.length;
    pendingPaystub.grossPay += selectedSales.reduce((acc, curr) => acc + getSaleAmount(curr), 0);
    pendingPaystub.netPay = pendingPaystub.grossPay;
    
    // update selected sales with paystub id
    const updated = await updateSelectedSalesToPaystub(selectedSales, pendingPaystub.id);
    if (!updated) error(500, 'Error updating sales');
    
    // save the paystub
    const paystubSaved = await insertPaystub(pendingPaystub);
    
    // test data
    return {
      paystub: paystubSaved,
    };
  },
  'add-manual-override': async ({ locals, request }) => {
    if (!locals.user) return fail(401, { message: 'Unauthorized' });
    
    const profile = await getUserProfileData(locals.user.id);
    
    if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) error(403, 'Forbidden');
    
    const payload = await request.formData();
    const data = Object.fromEntries(payload.entries());
    
    // todo: save the override
    
    return data;
  },
};