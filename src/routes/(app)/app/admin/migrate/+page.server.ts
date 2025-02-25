import type { Workflow } from '$lib/client/instantdb';
import type { SelectLegacyEmployee } from '$lib/drizzle/mysql/db.model';
import { getLegacyEmployeeListByIds, getLegacyEmployees } from '$lib/drizzle/mysql/models/employees';
import type { InsertEmployee, InsertEmployeeProfile } from '$lib/drizzle/postgres/db.model';
import { db } from '$lib/server/instantdb';
import { id } from '@instantdb/admin';
import { fail, json, redirect, type Actions } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { db as pgDb } from '$lib/drizzle/postgres/client';
import { employee, employeeProfile } from '$lib/drizzle/postgres/schema';
import { parseAddressData } from '$lib/utils/address-parser';

export const actions: Actions = {
  migrateEmployees: async ({ locals }) => {
    try {
      const clientId = locals.user.profile.clientId;
      
      if (!clientId) return fail(400, { message: 'No client found.' });
      
      const legacyEmployees = await getLegacyEmployees();
    
      if (!legacyEmployees || !legacyEmployees?.length) {
        throw new Error('No legacy employees found!');
      }
      
      const workflows = batchWorkflows(locals.user.id, 0, legacyEmployees.length - 1, legacyEmployees, []);
      await createWorkflows(workflows);  
      
      // process workflows now
      await processBatches(clientId, workflows);
      
      return {
        success: true,
        data: workflows,
      };
    } catch (error) {
      console.error(error);
      return fail(400, { error });
    }
  }
};

const processBatches = async (clientId: string, workflows: Partial<Workflow>[]) => {
  try {
    await pgDb.transaction(async (tx) => {
      const ees = [] as InsertEmployee[];
      const eps = [] as InsertEmployeeProfile[];
      
      for (const workflow of workflows) {
        const employeeIds = JSON.parse(workflow.data).employeeIds;
        const employees = await getLegacyEmployeeListByIds(employeeIds);
        
        for (const emp of employees) {
          const nameParts = emp.name.split(' ');
          const now = dayjs();
          
          const ee = {
            id: nanoid(),
            clientId,
            firstName: nameParts[0],
            lastName: nameParts[1],
            isCommissionable: !emp.hiddenPayroll && !emp.isAdmin && 
              !emp.isMgr && (
                emp.salesId1 != null || 
                emp.salesId2 != null ||
                emp.salesId3 != null),
            created: now.toDate(),
            updated: now.toDate(),
          } as InsertEmployee;
          
          ees.push(ee);
          
          const ep = parseAddressData(emp);
          
          eps.push({
            ...ep,
            id: nanoid(),
            employeeId: ee.id,
            email: emp.email,
            phone: emp.phoneNo,
          } as InsertEmployeeProfile);
        }
      }
      
      await tx.insert(employee).values(ees);
      await tx.insert(employeeProfile).values(eps);
    });
    
    for (const workflow of workflows) {
      if (workflow.id != null) 
        db.transact(db.tx.workflows[workflow.id].update({
          status: 'active',
          endDate: dayjs().toDate().toISOString(),
        }));
    }
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

const batchWorkflows = (userId: string, startIndex: number, endIndex: number, legacyEmployees: SelectLegacyEmployee[], workflows: Partial<Workflow>[]) => {
  if (endIndex > legacyEmployees.length) endIndex = legacyEmployees.length - 1;
  
  workflows.push({
    id: id(),
    executedByUserId: userId,
    description: `Migrate employees, batch ${startIndex + 1} - ${endIndex + 1}`,
    data: JSON.stringify({
      employeeIds: legacyEmployees.slice(startIndex, endIndex + 1).map(e => e.id),
    }),
    status: 'pending',
  } as Partial<Workflow>);
  
  const oldEndIndex = endIndex;
  startIndex = oldEndIndex + 1;
  endIndex = startIndex + 1000 > legacyEmployees.length ? legacyEmployees.length - 1 : startIndex + 1000;
  
  if (startIndex < endIndex) 
    return batchWorkflows(userId, startIndex, endIndex, legacyEmployees, workflows);
  
  return workflows;
}

const createWorkflows = async (reqs: Partial<Workflow>[]) => {
  for (const req of reqs) {
    await db.transact(db.tx.workflows[id()].update(req));
  }
}