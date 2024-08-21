import { getCampaigns } from '$lib/drizzle/postgres/models/campaigns';
import { getEmployeeByUserId } from '$lib/drizzle/postgres/models/employees';
import { getPaystubById } from '$lib/drizzle/postgres/models/paystubs.js';
import { getUserProfileData } from '$lib/drizzle/postgres/models/users';
import type { SelectPaystub, SelectUserProfile } from '$lib/drizzle/postgres/db.model.js';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getExpenseReportsByPaystubId } from '$lib/drizzle/postgres/models/expenses';

const canLoad = async (
	locals: App.Locals,
	profile: SelectUserProfile,
	payroll: SelectPaystub
): Promise<boolean> => {
	if (!locals.user) return false;
	if (!['super_admin', 'org_admin'].includes(profile.role)) {
		const ee = await getEmployeeByUserId(locals.user?.id);

		if (payroll?.employeeId !== ee?.id) {
			return false;
		}
	}

	return true;
};

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) return fail(401, { message: 'Unauthorized' });

	const profile = (await getUserProfileData(locals.user.id)) as unknown as SelectUserProfile;
	const clientId = profile?.clientId as string;
	const payrollId = params.id;
	const payroll = await getPaystubById(clientId, payrollId);
	const expenseReports = async () => {
		const reports = await getExpenseReportsByPaystubId(clientId, payrollId);
		return {
			reports,
			total: reports.reduce((p, v) => p + Number(v.totalAmount), 0)
		};
	};

	if (!(await canLoad(locals, profile, payroll))) error(403, 'Forbidden');

	return {
		paystub: payroll,
		campaigns: await getCampaigns(clientId),
		expenses: await expenseReports()
	};
};
