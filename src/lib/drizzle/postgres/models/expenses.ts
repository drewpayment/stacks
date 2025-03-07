import { db } from '$lib/drizzle/postgres/client';
import { expenseReport } from '../schema';
import { and, eq, inArray } from 'drizzle-orm';
import { fail, type ActionFailure } from '@sveltejs/kit';
import type { ExpenseReportResult } from '../types/expenses.model';

export const getExpenseReports = async (clientId: string): Promise<ExpenseReportResult[]> => {
	let reports: ExpenseReportResult[];

	try {
		reports = (await db.query.expenseReport.findMany({
			where: (expenseReport, { eq }) => eq(expenseReport.clientId, clientId),
			with: {
				items: true,
				employee: true,
				paystub: {
					with: {
						payrollCycle: true
					}
				}
			}
		})) as ExpenseReportResult[];
	} catch (err) {
		console.error(err);
		return [] as ExpenseReportResult[];
	}

	return reports;
};

export const getExpenseReport = async (
	clientId: string,
	reportId: string
): Promise<ExpenseReportResult | null> => {
	let report: ExpenseReportResult | null;

	try {
		report = (await db.query.expenseReport.findFirst({
			where: (expenseReport, { eq, and }) =>
				and(eq(expenseReport.clientId, clientId), eq(expenseReport.id, reportId)),
			with: {
				items: true,
				employee: true,
				paystub: {
					with: {
						payrollCycle: true
					}
				}
			}
		})) as ExpenseReportResult | null;
	} catch (err) {
		console.error(err);
		return null;
	}

	return report;
};

export const getExpenseReportsByPaystubId = async (
	clientId: string,
	paystubId: string
): Promise<ExpenseReportResult[]> => {
	let reports: ExpenseReportResult[];

	try {
		reports = (await db.query.expenseReport.findMany({
			where: (expenseReport, { eq, and }) =>
				and(eq(expenseReport.clientId, clientId), eq(expenseReport.paystubId, paystubId)),
			with: {
				items: true,
				employee: true,
				paystub: {
					with: {
						payrollCycle: true
					}
				}
			}
		})) as ExpenseReportResult[];
	} catch (err) {
		console.error(err);
		return [] as ExpenseReportResult[];
	}

	return reports;
};

export const saveExpenseReportsToPaystub = async (
	clientId: string,
	paystubId: string,
	reports: string[]
): Promise<void | ActionFailure<{ messsage: string }>> => {
	try {
		await db
			.update(expenseReport)
			.set({
				paystubId: paystubId
			})
			.where(and(eq(expenseReport.clientId, clientId), inArray(expenseReport.id, reports)));
	} catch (err) {
		console.error(err);
		return fail(400, { messsage: 'Failed to save expense reports to paystub' });
	}
};
