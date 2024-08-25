import { getCampaigns } from '$lib/drizzle/postgres/models/campaigns';
import { getEmployees } from '$lib/drizzle/postgres/models/employees';
import { getSales } from '$lib/drizzle/postgres/models/sales';
import { getUserProfileData } from '$lib/drizzle/postgres/models/users';
import type { SaleWithEmployee } from '$lib/drizzle/postgres/types/sale.model';
import { type Actions, error } from '@sveltejs/kit';
import dayjs from 'dayjs';
import type { PageServerLoad } from './$types';

const searchSales = async (clientId: string, startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
	const withStmt = {
		employee: {
			columns: {
				id: true,
				firstName: true,
				lastName: true
			}
		},
		campaign: {
			columns: {
				id: true,
				name: true
			}
		}
	};

	const res = await getSales<SaleWithEmployee>(clientId, startDate, endDate, withStmt);

	return structuredClone(res);
};

export const load: PageServerLoad = async ({ locals, request }) => {
	const profile = await getUserProfileData(locals.user!.id);

	if (!locals.user || !profile) error(401, 'Unauthorized');
	if (!['org_admin', 'super_admin'].includes(profile?.role)) error(403, 'Unauthorized');

	const clientId = profile?.clientId as string;

	const startDate = dayjs().subtract(1, 'month');
	const endDate = dayjs().add(15, 'day');

	const sales = async () => searchSales(clientId, startDate, endDate);

	return {
		sales: await sales(),
		startDate: startDate.format('YYYY-MM-DD'),
		endDate: endDate.format('YYYY-MM-DD'),
		campaigns: await getCampaigns(clientId),
		employees: await getEmployees(clientId, true)
	};
};

export const actions: Actions = {
	search: async ({ locals, request }) => {
		const profile = locals.user.profile;
		const clientId = profile.clientId as string;

		if (!locals.user) error(401, 'Unauthorized');
		if (!['org_admin', 'super_admin', 'admin'].includes(profile?.role)) error(401, 'Unauthorized');

		const formData = Object.fromEntries(await request.formData());

		const startDate = dayjs(formData.startDate as string, 'YYYY-MM-DD');
		const endDate = dayjs(formData.endDate as string, 'YYYY-MM-DD');

		const sales = await searchSales(clientId, startDate, endDate);
		const campaigns = await getCampaigns(clientId);
		const employees = await getEmployees(clientId, true);

		return {
			sales,
			startDate: startDate.toDate(),
			endDate: endDate.toDate(),
			campaigns,
			employees
		};
	}
};
