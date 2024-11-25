import { getPaystubById } from '$lib/drizzle/mysql/models/paystubs.js';
import type { SaleTableInputData } from '$lib/drizzle/postgres/types/sale-table-input-data.model';
import { fail } from '@sveltejs/kit';
import dayjs from 'dayjs';




export const load = async ({ locals, params }) => {
  const id = Number(params.id);
  
  if (!locals.user) return fail(401, { message: 'Unauthorized' });
  if (!['super_admin', 'admin'].includes(locals.user.profile.role)) return fail(403, { message: 'Forbidden' });
  if (isNaN(id) || id < 1) return fail(400, { message: 'Invalid ID' });
  
  const getData = async (id: number) => {
    const statement = await getPaystubById(id);
    if (!statement?.paystub) return {};
    
    const paystub = statement!.paystub!;
    
    const totalSales = statement?.sales.length;
    const totalOverrides = statement?.overrides.reduce((sum, override) => sum + parseFloat(override.total), 0);
    const totalExpenses = statement?.expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const [firstName, ...lastNameParts] = paystub.agentName.split(' ');
    const lastName = lastNameParts.join(' ');
    
    const saleTableData = {
      sales: statement?.sales.map(sale => ({
        id: sale.invoiceId.toString(),
        saleDate: sale.saleDate,
        customerName: `${sale.firstName} ${sale.lastName}`,
        address: sale.address,
        city: sale.city,
        amount: parseFloat(sale.amount),
        status: sale.status,
        createdAt: sale.createdAt || undefined,
        updatedAt: sale.updatedAt || undefined
      })),
      campaigns: [{
        id: paystub.vendorId.toString(),
        name: paystub.vendorName,
      }],
      employees: [{
        id: paystub.agentId,
        firstName,
        lastName,
      }],
      startDate: dayjs(paystub.weekendDate, 'YYYY-MM-DD').subtract(10, 'd').format('YYYY-MM-DD'),
      endDate: paystub.weekendDate,
    };
    
    return {
      ...statement,
      totals: {
        sales: totalSales,
        overrides: totalOverrides,
        expenses: totalExpenses,
      },
      tableData: saleTableData,
    };
  }
  
  try {
    return {
      statement: await getData(id),
    };
  } catch (error) {
    console.error(error);
    return fail(500, { message: 'Internal Server Error' });
  }
};