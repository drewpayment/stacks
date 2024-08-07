import { addPayrollCycle } from '$lib/drizzle/postgres/models/payroll-cycles';
import { getUserProfileData } from '$lib/drizzle/postgres/models/users';
import type { InsertPayrollCycle, SelectPayrollCycle } from '$lib/drizzle/postgres/db.model';
import { fail, type Actions } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';



export const actions: Actions = {
  add: async ({ locals, request }) => {
    let dto: InsertPayrollCycle;
    if (!locals.user) return fail(401, { message: 'Unauthorized' });
    
    try {
      const profile = await getUserProfileData(locals.user.id);
    
      const formData = await request.formData();
      const data = Object.fromEntries(formData);
      const today = dayjs().toDate();
      
      dto = {
        startDate: dayjs(data.startDate as any, 'YYYY-MM-DD').toDate(),
        endDate: dayjs(data.endDate as any, 'YYYY-MM-DD').toDate(),
        paymentDate: dayjs(data.payDate as any, 'YYYY-MM-DD').toDate(),
        clientId: profile?.clientId,
        id: nanoid(),
        created: today,
        updated: today,
      } as InsertPayrollCycle;
      
      await addPayrollCycle(dto);
    } catch (ex) {
      console.log(ex);
      return null;
    }
    
    return structuredClone(dto);
  },
};