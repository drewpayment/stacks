import { addPayrollCycle } from '$lib/drizzle/mysql/models/payroll-cycles';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import type { InsertPayrollCycle, SelectPayrollCycle } from '$lib/types/db.model';
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
      
      dto = {
        startDate: dayjs(data.startDate as any, 'YYYY-MM-DD').unix() as any,
        endDate: dayjs(data.endDate as any, 'YYYY-MM-DD').unix() as any,
        paymentDate: dayjs(data.payDate as any, 'YYYY-MM-DD').unix() as any,
        clientId: profile?.clientId,
        id: nanoid(),
        created: dayjs().unix() as any,
        updated: dayjs().unix() as any,
      } as InsertPayrollCycle;
      
      await addPayrollCycle(dto);
    } catch (ex) {
      console.log(ex);
      return null;
    }
    
    return dto;
  },
};