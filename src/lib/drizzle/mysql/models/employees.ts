import { legacyDb } from '../client';
import type { SelectLegacyEmployee, SelectLegacyManagerEmploeyee } from '../db.model';
import { legacyManagerEmployees } from '../schema';

export const getLegacyEmployees = async (): Promise<SelectLegacyEmployee[]> => {
	try {
		return await legacyDb.query.legacyEmployees.findMany({
			where: (legacyEmployees, { eq }) => eq(legacyEmployees.isActive, 1),
			orderBy: (legacyEmployees, { asc }) => asc(legacyEmployees.name),
		});
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
