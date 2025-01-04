import { legacyDb } from '../client';
import type { SelectLegacyEmployee, SelectLegacyManagerEmploeyee } from '../db.model';
import { getLatestPaystubDate, getLegacyEmployeePaystubsSinceDate } from './paystubs';

export const getLegacyEmployees = async (): Promise<SelectLegacyEmployee[]> => {
	try {
		return (await legacyDb.query.legacyEmployees.findMany({
			where: (legacyEmployees, { eq }) => eq(legacyEmployees.isActive, 1),
			orderBy: (legacyEmployees, { asc }) => asc(legacyEmployees.name),
		})) as SelectLegacyEmployee[];
	} catch (err) {
		console.error(err);
		return [] as SelectLegacyEmployee[];
	}
};

export const searchLegacyEmployees = async (page: number, take: number, search: string | undefined): Promise<{ data: SelectLegacyEmployee[], count: number }> => {
	try {
		return await legacyDb.transaction(async (tx) => {
			const data = (await tx.query.legacyEmployees.findMany({
				where: (legacyEmployees, { and, eq, like }) => search?.length 
					? and(
						eq(legacyEmployees.isActive, 1),
						like(legacyEmployees.name, `%${search}%`)
					)
					: eq(legacyEmployees.isActive, 1),
				orderBy: (legacyEmployees, { asc }) => asc(legacyEmployees.name),
				offset: (page - 1) * take,
				limit: take,
			})) as SelectLegacyEmployee[];
	
			const count = (await tx.query.legacyEmployees.findMany({
				where: (legacyEmployees, { and, eq, like }) => search?.length 
					? and(
						eq(legacyEmployees.isActive, 1),
						like(legacyEmployees.name, `%${search}%`)
					)
					: eq(legacyEmployees.isActive, 1),
			})).length;
	
			return { data, count };
		});
	} catch (err) {
		console.error(err);
		return { data: [] as SelectLegacyEmployee[], count: 0 };
	}
};

export const getLegacyEmployeesWithPayroll = async (): Promise<SelectLegacyEmployee[]> => {
	try {
		const latestPayrollDate = await getLatestPaystubDate();
		if (!latestPayrollDate) throw new Error('Failed to get latest payroll date.');
		const employees = await getLegacyEmployees();
		const paystubs = await getLegacyEmployeePaystubsSinceDate(latestPayrollDate, employees.map(e => e.id));
		return employees.filter(e => paystubs.some(p => p.agentId === e.id));
	} catch (err) {
		console.error(err);
		return [];
	}
};

export const getLegacyEmployee = async (employeeId: number): Promise<SelectLegacyEmployee> => {
	try {
		return (await legacyDb.query.legacyEmployees.findFirst({
			where: (legacyEmployees, { eq, and }) =>
				and(eq(legacyEmployees.id, employeeId), eq(legacyEmployees.isActive, 1)),
			with: {}
		})) as SelectLegacyEmployee;
	} catch (err) {
		console.error(err);
		return null as unknown as SelectLegacyEmployee;
	}
};

export const getLegacyManagerOfEmployee = async (
	ofEmployeeId: number
): Promise<SelectLegacyManagerEmploeyee> => {
	try {
		return (await legacyDb.query.legacyManagerEmployees.findFirst({
			where: (legacyManagerEmployees, { eq }) => eq(legacyManagerEmployees.employeeId, ofEmployeeId)
		})) as SelectLegacyManagerEmploeyee;
	} catch (err) {
		console.error(err);
		return null as unknown as SelectLegacyManagerEmploeyee;
	}
};
