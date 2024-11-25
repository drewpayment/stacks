import type { Dayjs } from 'dayjs';
import { legacyDb } from '../client';
import type { SelectLegacyExpense, SelectLegacyInvoice, SelectLegacyOverride, SelectLegacyPaystub } from '../db.model';

export const searchPaystubs = async (startDate: Dayjs, endDate: Dayjs, vendorId = -1, employeeId = -1): Promise<SelectLegacyPaystub[]> => {
  try {
    return await legacyDb.query.legacyPaystubs.findMany({
      where: (legacyPaystubs, { and, eq, gte, lte }) => and(
        vendorId > 0 ? eq(legacyPaystubs.vendorId, vendorId) : undefined,
        employeeId > 0 ? eq(legacyPaystubs.agentId, employeeId) : undefined,
        gte(legacyPaystubs.issueDate, startDate.toISOString().slice(0, 19).replace('T', ' ')),
        lte(legacyPaystubs.issueDate, endDate.toISOString().slice(0, 19).replace('T', ' ')),
      ),
      orderBy: (p, { desc }) => desc(p.issueDate),
    });
  } catch (err) {
    console.error(err);
    return [];
  }
}

export const getPaystubById = async (id: number): Promise<{
  paystub: SelectLegacyPaystub;
  sales: SelectLegacyInvoice[];
  overrides: SelectLegacyOverride[];
  expenses: SelectLegacyExpense[];
} | null> => {
  try {
    return await legacyDb.transaction(async (tx) => {
      const res = (await tx.query.legacyPaystubs.findFirst({
        where: (legacyPaystubs, { eq }) => eq(legacyPaystubs.id, id),
      })) as SelectLegacyPaystub;
      
      const sales = await tx.query.legacyInvoices.findMany({
        where: (i, { and, eq }) => and(
          eq(i.agentid, res.agentId),
          eq(i.vendor, `${res.vendorId}`),
          eq(i.issueDate, res.issueDate),
        ),
        orderBy: (i, { desc }) => desc(i.saleDate),
      });
      
      const overrides = await tx.query.legacyOverrides.findMany({
        where: (o, { and, eq }) => and(
          eq(o.agentid, res.agentId),
          eq(o.vendorId, res.vendorId),
          eq(o.issueDate, res.issueDate),
        ),
      });
      
      const expenses = await tx.query.legacyExpenses.findMany({
        where: (e, { and, eq }) => and(
          eq(e.agentid, res.agentId),
          eq(e.vendorId, res.vendorId),
          eq(e.issueDate, res.issueDate),
        ),
      });
      
      return {
        paystub: res,
        sales,
        overrides,
        expenses,
      };
    })
  } catch (err) {
    console.error(err);
    return null;
  }
}
