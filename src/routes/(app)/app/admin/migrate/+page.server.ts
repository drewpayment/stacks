import type { Workflow } from '$lib/client/instantdb';
import type { SelectLegacyEmployee } from '$lib/drizzle/mysql/db.model';
import { getLegacyEmployeeListByIds, getLegacyEmployees } from '$lib/drizzle/mysql/models/employees';
import type { InsertEmployee, InsertEmployeeProfile } from '$lib/drizzle/postgres/db.model';
import { db } from '$lib/server/instantdb';
import { id } from '@instantdb/admin';
import { fail, json, type Actions } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';



export const actions: Actions = {
  migrateEmployees: async ({ locals }) => {
    try {
      const legacyEmployees = await getLegacyEmployees();
    
      if (!legacyEmployees || !legacyEmployees?.length) {
        throw new Error('No legacy employees found!');
      }
      
      const workflows = batchWorkflows(locals.user.id, 0, legacyEmployees.length - 1, legacyEmployees, []);
      await createWorkflows(workflows);  
      
      // process workflows now
      
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

const processBatches = async (workflows: Workflow[]) => {
  for (const workflow of workflows) {
    const employeeIds = JSON.parse(workflow.data).employeeIds;
    const employees = await getLegacyEmployeeListByIds(employeeIds);
    
    for (const employee of employees) {
      const nameParts = employee.name.split(' ');
      const now = dayjs();
      
      const ee = {
        id: nanoid(),
        clientId: '',
        firstName: nameParts[0],
        lastName: nameParts[1],
        isCommissionable: !employee.hiddenPayroll && !employee.isAdmin && 
          !employee.isMgr && (
            employee.salesId1 != null || 
            employee.salesId2 != null ||
            employee.salesId3 != null),
        created: now.toDate(),
        updated: now.toDate(),
      } as InsertEmployee;
      
      const ep = {
        id: nanoid(),
        address: employee.address,
        address2: employee.address2,
        city: employee.city,
        state: employee.state,
        zip: employee.postalCode,
        employeeId: ee.id,
        email: employee.email,
        phone: employee.phoneNo,
      } as InsertEmployeeProfile;
    }
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