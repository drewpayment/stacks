import { getCampaigns } from '$lib/drizzle/postgres/models/campaigns';
import { getEmployeeByUserId } from '$lib/drizzle/postgres/models/employees';
import { getPaystubById } from '$lib/drizzle/postgres/models/paystubs.js';
import type { SelectPaystub, SelectUserProfile } from '$lib/drizzle/postgres/db.model.js';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const canLoad = async (
	locals: App.Locals,
	profile: SelectUserProfile,
	payroll: SelectPaystub
): Promise<boolean> => {
	if (!locals.user) return false;
	if (!['super_admin', 'org_admin'].includes(profile.role)) {
		const ee = await getEmployeeByUserId(locals.user.id);

		if (payroll?.employeeId !== ee?.id) {
			return false;
		}
	}

	return true;
};

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) return fail(401, { message: 'Unauthorized' });
	const profile = locals.user.profile;

	const payrollId = params.id;
	const payroll = await getPaystubById(profile?.clientId as string, payrollId);

	if (await canLoad(locals, profile, payroll)) {
		return {
			paystub: payroll,
			campaigns: await getCampaigns(profile?.clientId as string)
		};
	}

	error(403, 'Forbidden');
};
