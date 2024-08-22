import { getExpenseReports } from '$lib/drizzle/postgres/models/expenses.js';
import { type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getEmployees } from '$lib/drizzle/postgres/models/employees';
import { drizzleClient as db } from '$lib/drizzle/postgres/client';
import { payrollCycle } from '$lib/drizzle/postgres/schema';
import dayjs from 'dayjs';
import type { SelectOptionType } from 'flowbite-svelte';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) fail(401, { message: 'Unauthorized' });

	const clientId = locals.user.profile.clientId as string;

	const getReports = async () => await getExpenseReports(clientId);
	const loadEmployees = async () =>
		(await getEmployees(clientId, true)).map(
			(ee) => ({ name: `${ee.firstName} ${ee.lastName}`, value: ee.id }) as SelectOptionType<string>
		);
	const getPayPeriods = async () =>
		(
			await db.query.payrollCycle.findMany({
				columns: {
					id: true,
					startDate: true,
					endDate: true
				},
				where: (payrollCycle, { eq, gte, and }) =>
					and(
						eq(payrollCycle.clientId, clientId),
						gte(payrollCycle.paymentDate, dayjs().subtract(1, 'year').toDate())
					)
			})
		).map(
			(cycle) =>
				({
					name: `${cycle.startDate.toLocaleDateString()} - ${cycle.endDate.toLocaleDateString()}`,
					value: cycle.id
				}) as SelectOptionType<string>
		);

	return {
		reports: await getReports(),
		employees: await loadEmployees(),
		payPeriods: await getPayPeriods()
	};
};

export const actions: Actions = {};
