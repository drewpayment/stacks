import { eq } from 'drizzle-orm';
import { drizzleClient } from '../client';
import { paystub } from '../schema';
import type { PaystubWith } from '$lib/types/paystbus.model';

export const getPaystubs = async (clientId: string, startDate: number, endDate: number): Promise<PaystubWith[]> => {
  if (!clientId) {
    return [] as PaystubWith[];
  }
  
  const data = await drizzleClient.query.paystub.findMany({
    where: (ps, { eq, }) => eq(ps.clientId, clientId),
    with: {
      employee: true,
      campaign: true,
      payrollCycle: true,
      sales: {
        with: {
          employee: true,
        },
        where: (s, { and, gte, lte }) => and(
          gte(s.saleDate, startDate as any),
          lte(s.saleDate, endDate as any),
        ),
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
    await drizzleClient.update(paystub)
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
    await drizzleClient.update(paystub)
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
    await drizzleClient.update(paystub)
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
    await drizzleClient.update(paystub)
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
    const results = await drizzleClient.query.paystub.findMany({
      where: (ps, { eq }) => eq(ps.payrollCycleId, payrollCycleId),
    });
    
    data = results.length;
  } catch (ex) {
    console.error(ex);
    return 0;
  }
  
  return data;
}