import { eq, or } from 'drizzle-orm';
import { db } from '../client';
import { paystub } from '../schema';
import type { PaystubWith } from '$lib/drizzle/postgres/types/paystbus.model';
import type { InsertPaystub, } from '$lib/drizzle/postgres/db.model';
import { error } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

export const getPaystubs = async (
  clientId: string, 
  startDate: number, 
  endDate: number, 
  employeeId = '', 
  campaignId = '',
  filterPayrollCycles = false,
): Promise<PaystubWith[]> => {
  if (!clientId) {
    return [] as PaystubWith[];
  }
  
  const data = await db.query.paystub.findMany({
    where: filterPayrollCycles 
      ? (employeeId || campaignId)
        ? (ps, { eq, and, isNull }) => and(
            eq(ps.clientId, clientId),
            isNull(ps.payrollCycleId),
            employeeId ? eq(ps.employeeId, employeeId) : undefined,
            campaignId ? eq(ps.campaignId, campaignId) : undefined,
          )
        : (ps, { eq, and, isNull }) => and(
            eq(ps.clientId, clientId),
            isNull(ps.payrollCycleId),
          )
      : (employeeId || campaignId)
        ? (ps, { eq, and }) => and(
            eq(ps.clientId, clientId),
            employeeId ? eq(ps.employeeId, employeeId) : undefined,
            campaignId ? eq(ps.campaignId, campaignId) : undefined,
          )
        : (ps, { eq, }) => eq(ps.clientId, clientId),
    with: {
      employee: true,
      campaign: {
        columns: {
          name: true,
        }
      },
      payrollCycle: true,
      sales: {
        with: {
          employee: true,
        },
        where: (s, { and, gte, lte }) => and(
          gte(s.saleDate, dayjs(startDate).toDate()),
          lte(s.saleDate, dayjs(endDate).toDate()),
        ),
        orderBy: (s, { desc }) => [desc(s.saleDate)],
      },
    },
  }) as PaystubWith[];
  
  return data || [] as PaystubWith[];
}

export const getPaystubById = async (clientId: string, paystubId: string): Promise<PaystubWith> => {
  if (!clientId || !paystubId) return null as unknown as Promise<PaystubWith>;
  
  try {
    return await db.query.paystub.findFirst({
      where: (ps, { eq, and }) => and(
        eq(ps.clientId, clientId),
        eq(ps.id, paystubId),
      ),
      with: {
        sales: {
          with: {
            employee: true,
          },
        },
        employee: {
          with: {
            employeeProfile: true,
          },
        },
        campaign: true,
        payrollCycle: true,
        client: true,
      },
    }) as PaystubWith;
  } catch (ex) {
    console.error(ex);
    error(500, 'Internal Server Error');
  }
}

export const getPaystubsWoPayrollCycle = async (clientId: string, startDate: Date, endDate: Date): Promise<PaystubWith[]> => {
  if (!clientId) {
    return [] as PaystubWith[];
  }
  
  const data = await db.query.paystub.findMany({
    where: (ps, { and, eq, isNull }) => and(
      eq(ps.clientId, clientId),
      or(
        isNull(ps.payrollCycleId),
        eq(ps.payrollCycleId, ''),
      ),
    ),
    with: {
      employee: true,
      campaign: true,
      payrollCycle: true,
      sales: {
        with: {
          employee: true,
        },
        where: (s, { and, gte, lte, }) => and(
          gte(s.saleDate, startDate),
          lte(s.saleDate, endDate),
        ),
        orderBy: (s, { desc }) => [desc(s.saleDate)],
      },
    },
  }) as PaystubWith[];
  
  return data || [] as PaystubWith[];
}

export const getPaystubsByPayrollCycleId = async (clientId: string, payrollCycleId: string): Promise<PaystubWith[]> => {
  if (!payrollCycleId) return [] as PaystubWith[];
  
  const data = await db.query.paystub.findMany({
    where: (ps, { and, eq }) => and(
      eq(ps.clientId, clientId),
      eq(ps.payrollCycleId, payrollCycleId),
    ),
    with: {
      employee: true,
      campaign: true,
      payrollCycle: true,
      sales: {
        with: {
          employee: true,
        },
        orderBy: (s, { desc }) => [desc(s.saleDate)],
      },
    },
  }) as PaystubWith[];
  
  return data || [] as PaystubWith[];
}

/**
 * Remove associated payroll cycles from all paystubs by
 * the payroll cycle's id.
 * 
 * @param payrollCycleId 
 * @returns 
 */
export const detachPayrollCycleFromPaystubs = async (payrollCycleId: string): Promise<boolean> => {
  if (!payrollCycleId) return false;
  
  try {
    await db.update(paystub)
      .set({
        payrollCycleId: null,
      })
      .where(eq(paystub.payrollCycleId, payrollCycleId));
  } catch (ex) {
    console.error(ex);
    return false;
  }
  
  return true;
}

/**
 * Remove associated payroll cycles from a paystub by 
 * the paystub's id.
 * 
 * @param paystubId 
 * @returns 
 */
export const detachPayrollCycleFromPaystub = async (paystubId: string): Promise<boolean> => {
  if (!paystubId) return false;
  
  try {
    await db.update(paystub)
      .set({
        payrollCycleId: null,
      })
      .where(eq(paystub.id, paystubId));
  } catch (ex) {
    console.log(ex);
    return false;
  }
  
  return true;
}

export const detachPaystubFromPayrollCycles = async (paystubId: string): Promise<boolean> => {
  if (!paystubId) return false;
  
  try {
    await db.update(paystub)
      .set({
        payrollCycleId: null,
      })
      .where(eq(paystub.id, paystubId));
  } catch (ex) {
    console.error(ex);
    return false;
  }
  
  return true;
}

export const attachPayrollCycleToPaystub = async (paystubId: string, payrollCycleId: string): Promise<boolean> => {
  if (!paystubId || !payrollCycleId) return false;
  
  try {
    await db.update(paystub)
      .set({
        payrollCycleId,
      })
      .where(eq(paystub.id, paystubId));
  } catch (ex) {
    console.error(ex);
    return false;
  }
  
  return true;
}

export const numberOfPaystubsByPayrollCycleId = async (payrollCycleId: string): Promise<number> => {
  let data = 0;
  if (!payrollCycleId) return data;
  
  try {
    const results = await db.query.paystub.findMany({
      where: (ps, { eq }) => eq(ps.payrollCycleId, payrollCycleId),
    });
    
    data = results.length;
  } catch (ex) {
    console.error(ex);
    return 0;
  }
  
  return data;
}

export const generatePendingPaystub = (clientId: string, employeeId: string, campaignId: string): InsertPaystub => {
  return {
    id: nanoid(),
    clientId,
    employeeId,
    campaignId,
    payrollCycleId: null,
    totalSales: 0,
    totalOverrides: 0,
    grossPay: '0',
    netPay: '0',
    pieceRate: '0',
    otherDeductions: '0',
    taxDeductions: '0',
    created: dayjs().toDate(),
    updated: dayjs().toDate(),
  } as InsertPaystub;
}

export const insertPaystub = async (dto: InsertPaystub): Promise<InsertPaystub> => {
  if (!dto) return null as unknown as InsertPaystub;
  
  try {
    await db.insert(paystub).values({...dto});
  } catch (ex) {
    console.error(ex);
    error(500, 'Error saving paystub');
  }
  
  return dto;
}
