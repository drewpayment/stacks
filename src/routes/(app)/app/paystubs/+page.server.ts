import { getEmployeeByUserId } from '$lib/drizzle/postgres/models/employees';
import type { PaystubWith } from '$lib/drizzle/postgres/types/paystbus.model';
import { error, fail } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { drizzleClient as db } from '$lib/drizzle/postgres/client';

export const load = async ({ locals }) => {
  if (!locals.user) return fail(401, { message: 'Unauthorized' });
  
  const profile = locals.user.profile;
  
  if (!profile) error(403, 'Forbidden');
  
  const clientId = profile?.clientId || '';
  const startDate = dayjs().subtract(1, 'year');
  const endDate = dayjs();
  
  const paystubs = async () => {
    const employee = await getEmployeeByUserId(locals.user?.id as string);
    
    if (!employee) return [] as PaystubWith[];
    
    const stubs = await getPaystubs(clientId, startDate, endDate, employee?.id);
    
    return stubs;
  };
  
  return {
    startDate: startDate.format('YYYY-MM-DD'),
    endDate: endDate.format('YYYY-MM-DD'),
    paystubs: await paystubs(),
  };
}

const getPaystubs = async (clientId: string, startDate: dayjs.Dayjs, endDate: dayjs.Dayjs, employeeId: string) => {
  const data = await db.query.paystub.findMany({
    where: (ps, { eq, and }) => and(
      eq(ps.clientId, clientId),
      eq(ps.employeeId, employeeId),
    ),
    with: {
      employee: true,
      campaign: {
        columns: {
          name: true,
        }
      },
      payrollCycle: {
        columns: {
          id: true,
          paymentDate: true,
          isClosed: true,
        },
      },
      sales: {
        with: {
          employee: true,
        },
        where: (s, { and, gte, lte }) => and(
          gte(s.saleDate, startDate.toDate()),
          lte(s.saleDate, endDate.toDate()),
        ),
        orderBy: (s, { desc }) => [desc(s.saleDate)],
      },
    },
  }) as PaystubWith[];
  return data.filter(d => d.payrollCycle.isClosed);
}