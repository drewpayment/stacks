import { drizzleClient as db } from '$lib/drizzle/postgres/client';
import { and, eq } from 'drizzle-orm';
import { employee, employeeCodes, employeeNotes, employeeProfile } from '../schema';
import type { Employee, EmployeeProfile, InsertEmployee, InsertEmployeeCode, InsertEmployeeNotes, InsertEmployeeProfile, SelectEmployee, SelectEmployeeCode, SelectEmployeeProfile } from '$lib/drizzle/postgres/db.model';
import { nanoid } from 'nanoid';
import { error } from '@sveltejs/kit';

const getEmployees = async (clientId: string, isCommissionable = false): Promise<Employee[]> => {
  if (!clientId) {
    return [] as Employee[];
  }

  try {
    return await db.query.employee.findMany({
      with: {
        employeeProfile: true,
        employeeCodes: {
          where: (code, { eq }) => eq(code.isActive, true),
        },
      },
      where: (employee, { eq, and }) => isCommissionable
        ? and(eq(employee.clientId, clientId), eq(employee.isCommissionable, true))
        : eq(employee.clientId, clientId),
    }) as Employee[];
  } catch (ex) {
    console.error(ex);
    return [] as Employee[];
  }
}

/**
 * Gets an employee by their email address
 * 
 * @param email - The email address to look up
 * @returns Promise containing the Employee object if found, undefined if not found
 */
export const getEmployeeByEmail = async (email: string | undefined): Promise<SelectEmployee & { employeeProfile: SelectEmployeeProfile } | undefined> => {
  if (!email) {
    return undefined;
  }

  try {
    const result = await db.transaction(async (tx) => {
      const profile = await tx.query.employeeProfile.findFirst({
        where: (profile, { eq }) => eq(profile.email, email),
      }) as SelectEmployeeProfile;
      
      const employee = await tx.query.employee.findFirst({
        where: (employee, { eq }) => eq(employee.id, profile.employeeId),
      }) as Employee;
      
      return {
        ...employee,
        employeeProfile: profile,
      };
    });
    
    return result;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};


/**
 * Gets a list of employees for a given client ID with optional search filtering
 * 
 * @param clientId - The ID of the client to get employees for
 * @param page - The page number to return (1-based)
 * @param take - The number of records to return per page
 * @param search - Optional search string to filter employees by first or last name
 * @returns Promise containing array of Employee objects and total count
 * 
 * The search parameter will filter employees where either first name OR last name 
 * contains the search string (case-insensitive). Only returns commissionable employees.
 * 
 * Returns employee records with their associated profile and active employee codes.
 */

export const searchEmployees = async (clientId: string, page: number, take: number, search: string | undefined): Promise<{ data: Employee[], count: number }> => {
  if (!clientId) {
    return { data: [] as Employee[], count: 0 };
  }
  
  const offset = (page - 1) * take;

  try {
    const data = await db.query.employee.findMany({
      with: {
        employeeProfile: true,
        employeeCodes: {
          where: (code, { eq }) => eq(code.isActive, true),
        },
      },
      where: (employee, { eq, and, like, or }) => search !== undefined 
        ? and(
            or(like(employee.firstName, search), like(employee.lastName, search)), 
            eq(employee.clientId, clientId), 
            eq(employee.isCommissionable, true)
          )
        : and(eq(employee.clientId, clientId), eq(employee.isCommissionable, true)),
      offset,
      limit: take,
    }) as Employee[];

    const count = (await db.query.employee.findMany({
      where: (employee, { eq, and, like, or }) => search !== undefined 
        ? and(
            or(like(employee.firstName, search), like(employee.lastName, search)), 
            eq(employee.clientId, clientId), 
            eq(employee.isCommissionable, true)
          )
        : and(eq(employee.clientId, clientId), eq(employee.isCommissionable, true)),
    })).length;

    return { data, count };
  } catch (ex) {
    console.error(ex);
    return { data: [] as Employee[], count: 0 };
  }
}

const getEmployee = async (employeeId: string, withProfile = true, withCodes = true, withNotes = true, withOverride = true): Promise<Employee | undefined> => {
  if (!employeeId) {
    return null as unknown as Employee;
  }

  const data = await db.query.employee.findFirst({
    with: {
      employeeProfile: withProfile as any,
      employeeCodes: withCodes ? {
        where: (code, { eq }) => eq(code.isActive, true),
      } : false as any,
      employeeNotes: withNotes ? {
        orderBy: (employeeNotes, { desc }) => [desc(employeeNotes.created)],
      } : false as any,
      overrideTo: withOverride ? {
        employeeId: true,
      } : false as any,
    },
    where: (employee, { eq }) => eq(employee.id, employeeId),
  });

  return data as any;
}

export const getEmployeeByUserId = async (userId: string): Promise<Employee> => {
  if (!userId) {
    return null as unknown as Employee;
  }

  const data = await db.query.employee.findFirst({
    with: {
      employeeProfile: true,
    },
    where: (employee, { eq }) => eq(employee.userId, userId),
  });

  return data as Employee;
}

export const getEmployeeProfile = async (employeeId: string): Promise<EmployeeProfile> => {
  if (!employeeId) return null as unknown as EmployeeProfile;
  
  const data = await db.query.employeeProfile.findFirst({
    where: (employeeProfile, { eq }) => eq(employeeProfile.employeeId, employeeId),
  });
  
  return data as EmployeeProfile;
}

const _createEmployee = async (employeeData: InsertEmployee) => {
  try {
    await db.insert(employee)
      .values({
        ...employeeData,
      });
  } catch (err) {
    console.error(err);
    return { success: false, };
  }

  return { success: true, };
}

const createEmployee = async (employeeData: InsertEmployee, employeeProfileData: InsertEmployeeProfile) => {
  const employeeResult = await _createEmployee({ ...employeeData, isCommissionable: true, });

  if (!employeeResult.success) {
    return employeeResult;
  }

  try {
    await db.insert(employeeProfile)
      .values({ ...employeeProfileData });
  } catch (err) {
    console.error(err);
    return { success: false, };
  }

  return { success: true, };
}

const updateEmployee = async (employeeData: InsertEmployee) => {
  try {
    await db.update(employee)
      .set({
        ...employeeData,
        updated: Date.now() as any,
      })
      .where(eq(employee.id, employeeData.id));
  } catch (err) {
    console.error(err);
    return { success: false, };
  }

  return { success: true, };
}

export const updateEmployeeProfile = async (data: InsertEmployeeProfile) => {
  try {
    await db.update(employeeProfile)
      .set(data)
      .where(eq(employeeProfile.employeeId, data.employeeId));
  } catch (err) {
    console.error(err);
    return { success: false, };
  }
  return { success: true, };
}

const deleteEmployee = async (employeeId: string) => {
  try {
    await db.update(employee)
      .set({
        deleted: Date.now() as any,
      })
      .where(eq(employee.id, employeeId));
  } catch (err) {
    console.error(err);
    return { success: false, };
  }

  return { success: true, };
}

const addEmployeeNote = async (employeeId: string, note: string) => {

  const dto = {
    id: nanoid(),
    employeeId,
    note,
    created: Date.now() as any,
  } as InsertEmployeeNotes;

  try {
    await db.insert(employeeNotes).values(dto);
  } catch (err) {
    console.error(err);
    return { success: false, };
  }

}

export const getEmployeeIdByCampaignSalesCode = async (campaignId: string, salesCode: string): Promise<string> => {
  if (!salesCode) return '';

  try {
    // const ee = await db.query.employee.findFirst({
    //   with: {
    //     employeeCodes: {
    //       where: (code, { eq, and }) => and(
    //         eq(code.campaignId, campaignId),
    //         eq(code.employeeCode, salesCode),
    //       ),
    //     },
    //   },
    // });

    const res = (await db.select({ id: employee.id, })
      .from(employee)
      .innerJoin(employeeCodes, eq(employee.id, employeeCodes.employeeId))
      .where(and(
        eq(employeeCodes.campaignId, campaignId),
        eq(employeeCodes.employeeCode, salesCode),
      ))
      .execute());

    // const employeeId = res[0]?.id || '';

    return res[0]?.id || '';
  } catch (ex) {
    console.error(ex);
    return '';
  }
}

export const upsertEmployeeCodes = async (dtos: { employeeId: string, employeeCode: string, campaignId: string, isActive: boolean }[]) => {
  if (!dtos || dtos.length < 1) return;

  const results: SelectEmployeeCode[] = [];

  dtos.forEach(async dto => {
    const curr = await db.query.employeeCodes.findFirst({
      where: (code, { eq }) => and(
        eq(code.employeeId, dto.employeeId),
        eq(code.campaignId, dto.campaignId),
      ),
    }) as SelectEmployeeCode;

    try {
      if (curr && curr.employeeCode !== dto.employeeCode) {
        await db.update(employeeCodes)
          .set({
            employeeCode: dto.employeeCode,
            isActive: dto.isActive,
          })
          .where(and(
            eq(employeeCodes.employeeId, curr.employeeId),
            eq(employeeCodes.campaignId, curr.campaignId),
          ));

        results.push({
          ...dto,
        } as SelectEmployeeCode);
      } else if (!curr) {
        const insertId = nanoid();

        await db.insert(employeeCodes)
          .values({
            id: insertId,
            employeeId: dto.employeeId,
            employeeCode: dto.employeeCode,
            campaignId: dto.campaignId,
            isActive: dto.isActive,
            created: Date.now() as any,
            updated: Date.now() as any,
          } as InsertEmployeeCode);

        results.push({
          ...dto,
          // id: insertId, // TODO: Not sure if this is going to break functionality with employee codes...
        });
      }
    } catch (ex) {
      console.error(ex);
      error(500, { message: 'Error upserting employee codes' });
    }
  });

  return results;
}

export {
  getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee,
  addEmployeeNote,
};