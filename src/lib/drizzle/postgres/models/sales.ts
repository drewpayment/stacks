import type { InsertSale, SaleDto, SelectSale } from '$lib/drizzle/postgres/db.model';
import { nanoid } from 'nanoid';
import { db } from '../client';
import { sale } from '../schema';
import dayjs from 'dayjs';
import { desc, inArray } from 'drizzle-orm';
import type { ImportRow } from '$lib/drizzle/postgres/types/sale.model';
import { getEmployeeIdByCampaignSalesCode } from './employees';
import { error } from '@sveltejs/kit';

export const toInsertSale = (data: any): InsertSale => ({
  id: data.id || nanoid(),
  clientId: data.client_id,
  campaignId: data.campaign_id,
  saleDate: dayjs(data.sale_date).toDate(),
  saleAmount: data.sale_amount,
  statusDescription: data.status_description,
  isComplete: data.is_complete,
  employeeId: data.employee_id,
  customerFirstName: data.customer_first_name,
  customerLastName: data.customer_last_name,
  customerAddress: data.customer_address,
  created: dayjs(data.created).toDate(),
  updated: dayjs(data.updated).toDate(),
} as InsertSale);

export const toClientDto = (data: InsertSale | SelectSale): SaleDto => ({
  id: data.id,
  client_id: data.clientId,
  campaign_id: data.campaignId,
  sale_date: data.saleDate as unknown as number,
  sale_amount: data.saleAmount != null ? Number(data.saleAmount) : 0,
  status_description: data.statusDescription as string,
  is_complete: !!data.isComplete,
  employee_id: data.employeeId,
  created: data.created,
  updated: data.updated,
  customer_first_name: data.customerFirstName,
  customer_last_name: data.customerLastName,
  customer_address: data.customerAddress,
});

export const saveSale = async (dto: InsertSale): Promise<SelectSale> => {
  dto.id = nanoid();
  
  if (!dto.paystubId) dto.paystubId = null;
  
  try {
    await db.insert(sale).values({...dto});
  } catch (ex) {
    console.error(ex);
    return null as unknown as SelectSale;
  }
  
  return dto as SelectSale;
}

export const saveSales = async (dtos: InsertSale[]): Promise<SelectSale[]> => {
  
  try {
    await db.insert(sale).values(dtos);
  } catch (ex) {
    console.error(ex);
    error(500, { message: 'Error saving sales' });
  }
  
  return dtos as SelectSale[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSales = async <T = SelectSale>(clientId: string, startDate: dayjs.Dayjs, endDate: dayjs.Dayjs, withStmt: any = undefined): Promise<T[]> => {
  const sales = await db.query.sale.findMany({
    with: withStmt || undefined,
    where: (sale, { and, eq, lte, gte }) => and(
      eq(sale.clientId, clientId),
      lte(sale.saleDate, endDate.toDate()),
      gte(sale.saleDate, startDate.toDate()),
    ),
    orderBy: s => desc(s.saleDate),
  });
  
  return sales as T[];
}

export const getUnallocatedSalesByEmployee = async (clientId: string, campaignId: string, employeeId: string): Promise<SelectSale[]> => {
  const sales = await db.query.sale.findMany({
    where: (sale, { and, eq, isNull }) => and(
      eq(sale.clientId, clientId),
      eq(sale.campaignId, campaignId),
      eq(sale.employeeId, employeeId),
      isNull(sale.paystubId),
      // eq(sale.paystubId, ''),
      eq(sale.isComplete, false),
    ),
    orderBy: (s, { desc, asc }) => [
      asc(s.statusDescription),
      desc(s.saleDate),
    ],
  });
  
  return sales;
}

const formatStatusDescription = (statusDescription: string): 'approved' | 'pending' | 'rejected' => {
  const status = statusDescription.toLowerCase().trim();
  
  if (status.includes('accepted') || status.includes('confirmed')) return 'approved';
  if (status.includes('pending')) return 'pending';
  if (status.includes('rejected') || status.includes('rescinded') || status.includes('invalid')) return 'rejected';
  
  return 'pending';
}

/**
 * Processes xlsx import file and returns an object with good and bad sales
 * 
 * @param client_id 
 * @param campaign_id 
 * @param rows 
 * @returns Promise<InsertSale[]>
 */
export const processImport = async (client_id: string, campaign_id: string, rows: ImportRow[]): Promise<InsertSale[]> => {
  const employeeDict = {} as Record<string, string>;
  const getEmployeeId = async (campaignId: string, salesCode: string): Promise<string> => {
    const key = `${campaignId}|${salesCode}`;
    if (employeeDict[key]) return employeeDict[key];
    const employeeId = await getEmployeeIdByCampaignSalesCode(campaignId, salesCode);
    employeeDict[key] = employeeId;
    return employeeId;
  }
  
  const insertRows = await Promise.all(rows.map(async r => {
    for (const p in r) {
      const fixedP = p.toLowerCase().trim();
      if (fixedP !== p) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (r as any)[fixedP] = (r as any)[p];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (r as any)[p];
      }
    }
    const isComplete = r.status_description.toLowerCase().trim().includes('accepted');
    const employee_id = await getEmployeeId(campaign_id, r.sales_code) || `MISSING|${r.sales_code}`;
    
    const dto = {
      employee_id,
      client_id,
      campaign_id,
      sale_date: r.sale_date,
      customer_first_name: r.customer_first_name,
      customer_last_name: r.customer_last_name,
      customer_address: r.customer_address,
      status_description: formatStatusDescription(r.status_description),
      is_complete: isComplete,
      sale_amount: r.sale_amount,
    }
    return toInsertSale(dto);
  }));
  
  return insertRows;
}

export const updateSelectedSalesToPaystub = async (sales: SelectSale[], paystubId: string): Promise<boolean> => {
  if (!sales?.length) return Promise.resolve(false);
  
  try {
    await db.update(sale)
      .set({ paystubId, isComplete: true, })
      .where(inArray(sale.id, sales.map(s => s.id)));
  } catch (ex) {
    console.error(ex);
    return Promise.resolve(false);
  }
    
  return true;
}