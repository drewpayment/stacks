import { getExpenseReport } from '$lib/drizzle/postgres/models/expenses.js';
import { fail, type Actions } from '@sveltejs/kit';
import { drizzleClient as db } from '$lib/drizzle/postgres/client.js';
import { expenseReport } from '$lib/drizzle/postgres/schema.js';
import { eq } from 'drizzle-orm';
import dayjs from 'dayjs';
import { getPayrollCycles } from '$lib/drizzle/postgres/models/payroll-cycles.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { id: expenseReportId } = params;

	if (!locals.user) fail(401, { message: 'Unauthorized' });

	const clientId = locals.user.profile.clientId as string;

	const getReport = async () => await getExpenseReport(clientId, expenseReportId);
	const getPaystubs = async () => {
		const report = await getExpenseReport(clientId, expenseReportId);
		const cycles = await getPayrollCycles(clientId, false);
		const paystubs = (
			await db.query.paystub.findMany({
				with: {
					payrollCycle: true
				},
				where: (paystub, { and, eq, inArray }) =>
					and(
						eq(paystub.employeeId, report?.employeeId as string),
						inArray(
							paystub.payrollCycleId,
							cycles.map((c) => c.id)
						)
					)
			})
		).map((p) => ({
			name: `${p.payrollCycle?.startDate.toLocaleDateString()} - ${p.payrollCycle?.endDate.toLocaleDateString()}`,
			value: p.id
		}));

		return paystubs;
	};

	return {
		report: await getReport(),
		paystubs: await getPaystubs()
	};
};

export const actions: Actions = {
	approve: async ({ locals, request }) => {
		if (!locals.user) return fail(401, { message: 'Unauthorized' });
		const role = locals.user.profile.role;

		if (!['super_admin', 'org_admin'].includes(role)) return fail(401, { message: 'Unauthorized' });

		const { reportId } = Object.fromEntries(await request.formData());
		const now = dayjs().toDate();

		try {
			await db
				.update(expenseReport)
				.set({
					approvalStatus: 'approved',
					approvalDate: now,
					updated: now
				})
				.where(eq(expenseReport.id, reportId as string));
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'Something went wrong' });
		}

		return { success: true };
	},
	setPaystub: async ({ locals, request }) => {
		if (!locals.user) return fail(401, { message: 'Unauthorized' });
		const role = locals.user.profile.role;

		if (!['super_admin', 'org_admin'].includes(role)) return fail(401, { message: 'Unauthorized' });

		const { reportId, paystubId } = Object.fromEntries(await request.formData());

		console.log(reportId, paystubId);

		// try {
		//   await db.update(expenseReport)
		//     .set({

		//     })
		// }
	}
};
