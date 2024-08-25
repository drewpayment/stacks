import { getPayrollCycles } from '$lib/drizzle/postgres/models/payroll-cycles';
import { numberOfPaystubsByPayrollCycleId } from '$lib/drizzle/postgres/models/paystubs.js';
import { getUserProfileData } from '$lib/drizzle/postgres/models/users';
import type { SelectPayrollCycle } from '$lib/drizzle/postgres/db.model.js';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) return fail(401, { message: 'Unauthorized' });

	const payrollCycles = async (): Promise<(SelectPayrollCycle & { paystubCount: number })[]> => {
		const profile = await getUserProfileData(locals.user?.id);

		if (!profile || !['super_admin', 'org_admin'].includes(profile.role)) return [];

		const payrollCycles = await getPayrollCycles(profile?.clientId as string);

		const payrollCyclesWithPaystubCount = payrollCycles.map(async (pc) => {
			const count = await numberOfPaystubsByPayrollCycleId(pc.id);

			return {
				...pc,
				paystubCount: count
			};
		});

		return await Promise.all(payrollCyclesWithPaystubCount);
	};

	const showClosedCycles = url.searchParams.get('closed') === 'true';

	return {
		payrollCycles: await payrollCycles(),
		showClosedCycles
	};
};
