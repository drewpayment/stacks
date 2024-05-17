import type { InsertPayrollCycle, SelectPayrollCycle } from '$lib/drizzle/postgres/db.model';
import { eq } from 'drizzle-orm';
import { drizzleClient } from '../client';
import { payrollCycle } from '../schema';

export const getPayrollCycles = async (clientId: string, showIsClosed = true): Promise<SelectPayrollCycle[]> => {
  if (!clientId) {
    return [];
  }
  
  const data = await drizzleClient.query.payrollCycle.findMany({
    where: showIsClosed 
      ? (pc, { eq }) => eq(pc.clientId, clientId)
      : (pc, { and, eq }) => and(
        eq(pc.clientId, clientId),
        eq(pc.isClosed, false),
      ),
    orderBy: (pc, { asc }) => [asc(pc.startDate)],
  });
  
  return data || [];
}

export const getPayrollCycle = async (id: string): Promise<SelectPayrollCycle> => {
  if (!id) return null as unknown as SelectPayrollCycle;
  
  const data = await drizzleClient.query.payrollCycle.findFirst({
    where: (pc, { eq }) => eq(pc.id, id),
  });
  
  return data || null as unknown as SelectPayrollCycle;
}

export const addPayrollCycle = async (dto: InsertPayrollCycle): Promise<SelectPayrollCycle | null> => {
  if (!dto) return null;
  
  try {
    await drizzleClient.insert(payrollCycle)
      .values(dto);
  } catch (ex) {
    console.error(ex);
    return null;
  }
  
  return {...dto} as SelectPayrollCycle;
}

export const togglePayrollCycleClose = async (id: string, isClosed: string): Promise<boolean> => {
  if (!id) return false;
  
  try {
    await drizzleClient.update(payrollCycle)
      .set({
        isClosed: (isClosed === 'true'),
      })
      .where(eq(payrollCycle.id, id));
  } catch (ex) {
    console.error(ex);
    return false;
  }
  
  return true;
}