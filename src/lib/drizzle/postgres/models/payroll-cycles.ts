import type {
	InsertPayrollCycle,
	SelectPayrollCycle,
	SelectPaystub
} from '$lib/drizzle/postgres/db.model';
import { eq } from 'drizzle-orm';
import { db } from '../client';
import { payrollCycle } from '../schema';
import dayjs from 'dayjs';

export const getPayrollCycles = async (
	clientId: string,
	showIsClosed = true
): Promise<SelectPayrollCycle[]> => {
	if (!clientId) {
		return [];
	}

	const data = await db.query.payrollCycle.findMany({
		where: showIsClosed
			? (pc, { eq }) => eq(pc.clientId, clientId)
			: (pc, { and, eq }) => and(eq(pc.clientId, clientId), eq(pc.isClosed, false)),
		orderBy: (pc, { desc }) => [desc(pc.paymentDate)]
	});

	return data || [];
};

export const getLastPayrollCycle = async (
	clientId: string
): Promise<(SelectPayrollCycle & { paystubs: SelectPaystub[] }) | null> => {
	if (!clientId) return null;

	const data = await db.query.payrollCycle.findFirst({
		where: (pc, { eq, and, lte }) =>
			and(eq(pc.clientId, clientId), lte(pc.paymentDate, dayjs().toDate())),
		orderBy: (pc, { desc }) => [desc(pc.startDate)],
		with: {
			paystubs: {
				with: {
					employee: true
				},
				orderBy: (ps, { asc, desc }) => [desc(ps.netPay)],
				limit: 5
			}
		}
	});

	return data || null;
};

export const getPayrollCycle = async (id: string): Promise<SelectPayrollCycle> => {
	if (!id) return null as unknown as SelectPayrollCycle;

	const data = await db.query.payrollCycle.findFirst({
		where: (pc, { eq }) => eq(pc.id, id)
	});

	return data || (null as unknown as SelectPayrollCycle);
};

export const addPayrollCycle = async (
	dto: InsertPayrollCycle
): Promise<SelectPayrollCycle | null> => {
	if (!dto) return null;

	try {
		await db.insert(payrollCycle).values(dto);
	} catch (ex) {
		console.error(ex);
		return null;
	}

	return { ...dto } as SelectPayrollCycle;
};

export const togglePayrollCycleClose = async (id: string, isClosed: boolean): Promise<boolean> => {
	if (!id) return false;

	try {
		await db
			.update(payrollCycle)
			.set({
				isClosed: Boolean(isClosed)
			})
			.where(eq(payrollCycle.id, id));
	} catch (ex) {
		console.error(ex);
		return false;
	}

	return true;
};
