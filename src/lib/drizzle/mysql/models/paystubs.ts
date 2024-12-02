import type { Dayjs } from 'dayjs';
import { legacyDb } from '../client';
import type { SelectLegacyExpense, SelectLegacyInvoice, SelectLegacyOverride, SelectLegacyPaystub } from '../db.model';
import { legacyPaystubs } from '../schema';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import dayjs from 'dayjs';

export const searchPaystubs = async (
  startDate: Dayjs,
  endDate: Dayjs,
  take: number,
  page: number,
  vendorId: number,
  employeeId: number,
): Promise<{
  data: SelectLegacyPaystub[];
  pagination: {
    total: number;
    offset: number;
    limit: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }
}> => {
  const offset = (page - 1) * take;
  
  try {
    const total = (await legacyDb
      .select({ count: sql<number>`count(*)` })
      .from(legacyPaystubs)
      .where(and(
        vendorId > 0 ? eq(legacyPaystubs.vendorId, vendorId) : undefined,
        employeeId > 0 ? eq(legacyPaystubs.agentId, employeeId) : undefined,
        gte(legacyPaystubs.issueDate, startDate.toISOString().slice(0, 19).replace('T', ' ')),
        lte(legacyPaystubs.issueDate, endDate.toISOString().slice(0, 19).replace('T', ' ')),
      )))[0].count;
      
    const totalPages = Math.ceil(total / take);
    
    return {
      data: await legacyDb.query.legacyPaystubs.findMany({
        where: (legacyPaystubs, { and, eq, gte, lte }) => and(
          vendorId > 0 ? eq(legacyPaystubs.vendorId, vendorId) : undefined,
          employeeId > 0 ? eq(legacyPaystubs.agentId, employeeId) : undefined,
          gte(legacyPaystubs.issueDate, startDate.toISOString().slice(0, 19).replace('T', ' ')),
          lte(legacyPaystubs.issueDate, endDate.toISOString().slice(0, 19).replace('T', ' ')),
        ),
        orderBy: (p, { desc }) => desc(p.issueDate),
        limit: take,
        offset,
      }) as SelectLegacyPaystub[],
      pagination: {
        total,
        offset,
        limit: take,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    }
  } catch (err) {
    console.error(err);
    return {
      data: [],
      pagination: {
        total: 0,
        offset,
        limit: take,
        totalPages: 0,
        currentPage: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
}

export const getPaystubDetailById = async (id: number): Promise<{
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

export const getLegacyEmployeePaystubsSinceDate = async (sinceDate: Dayjs, employees: number[]): Promise<SelectLegacyPaystub[]> => {
  try {
    return await legacyDb.query.legacyPaystubs.findMany({
      where: (legacyPaystubs, { and, eq, gte, lte, inArray }) => and(
        inArray(legacyPaystubs.agentId, employees),
        gte(legacyPaystubs.issueDate, sinceDate.subtract(1, 'year').toISOString()),
        lte(legacyPaystubs.issueDate, sinceDate.toISOString()),
      ),
      orderBy: (p, { desc }) => desc(p.issueDate),
    }) as SelectLegacyPaystub[];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export const getLatestPaystubDate = async (): Promise<Dayjs | null> => {
  try {
    const res = await legacyDb.query.legacyPaystubs.findFirst({
      orderBy: (p, {desc}) => desc(p.issueDate),
    });
    return dayjs(res!.issueDate, 'YYYY-MM-DD');
  } catch (err) {
    console.error(err);
    return null;
  }
}