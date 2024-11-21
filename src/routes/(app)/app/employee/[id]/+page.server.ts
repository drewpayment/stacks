import { getCampaigns } from '$lib/drizzle/postgres/models/campaigns.js';
import {
	addEmployeeNote,
	getEmployee,
	getEmployees,
	upsertEmployeeCodes
} from '$lib/drizzle/postgres/models/employees';
import { saveOverridingEmployee } from '$lib/drizzle/postgres/models/overrides.js';
import { getUserProfileData } from '$lib/drizzle/postgres/models/users.js';
import type {
	EmployeeWithNotes,
	SelectEmployeeProfile,
	SelectOverridingEmployee
} from '$lib/drizzle/postgres/db.model';
import { error, fail } from '@sveltejs/kit';
import type { RouteParams } from './$types';
import { getLegacyEmployee, getLegacyManagerOfEmployee } from '$lib/drizzle/mysql/models/employees';

export const load = async ({
	locals,
	params,
	url
}: {
	locals: App.Locals;
	params: RouteParams;
	url: URL;
}) => {
	const id = params.id;
	if (!locals.user) return fail(401, { message: 'Unauthorized' });

	const profile = await getUserProfileData(locals.user.id);
	const clientId = profile?.clientId || '';

	if (!clientId) error(403, 'Forbidden');

	const mode = url.searchParams.get('mode');
	const isLegacy = mode && mode.toLowerCase() === 'legacy';

	const campaigns = async () => {
		return getCampaigns(clientId as string);
	};

	const allEmployees = async () =>
		(await getEmployees(clientId))
			.filter((ee) => ee.id !== id)
			.map((ee) => ({
				name: `${ee.firstName} ${ee.lastName}`,
				value: ee.id
			}));

	const employee = async () => {
		let result = {} as EmployeeWithNotes & { overrideTo: SelectOverridingEmployee };

		if (isLegacy) {
			const legacyEmployee = await getLegacyEmployee(Number(id));
			const nameParts = legacyEmployee.name.split(' ');

			result.id = `${legacyEmployee.id}`;
			result.clientId = clientId;
			result.firstName = nameParts[0];
			result.lastName = nameParts[1];
			result.isCommissionable =
				legacyEmployee.salesId1 != null ||
				legacyEmployee.salesId2 != null ||
				legacyEmployee.salesId3 != null;
			result.employeeProfile = {
				address: legacyEmployee.address,
				address2: legacyEmployee.address2,
				city: legacyEmployee.city || '',
				state: legacyEmployee.state || '',
				zip: legacyEmployee.postalCode || '',
				phone: legacyEmployee.phoneNo || '',
				email: legacyEmployee.email,
				employeeId: `${legacyEmployee.id}`
			} as SelectEmployeeProfile;
			result.employeeNotes = [];
			result.employeeCodes = [
				{
					employeeId: `${legacyEmployee.id}`,
					employeeCode: legacyEmployee.salesId1,
					isActive: true,
					campaignId: ''
				},
				{
					employeeId: `${legacyEmployee.id}`,
					employeeCode: legacyEmployee.salesId2,
					isActive: true,
					campaignId: ''
				},
				{
					employeeId: `${legacyEmployee.id}`,
					employeeCode: legacyEmployee.salesId3,
					isActive: true,
					campaignId: ''
				}
			];

			const manager = await getLegacyManagerOfEmployee(legacyEmployee.id);

			result.overrideTo =
				manager != null
					? {
							id: '',
							employeeId: `${legacyEmployee.id}`,
							overrideAmount: '',
							overridesEmployeeId: `${manager.managerId}`
						}
					: (null as unknown as any);

			return result;
		} else {
			result = (await getEmployee(id)) as unknown as EmployeeWithNotes & {
				overrideTo: SelectOverridingEmployee;
			};
		}

		return result;
	};

	return {
		ee: await employee(),
		campaigns: await campaigns(),
		employees: await allEmployees()
	};
};

export const actions = {
	'add-note': async ({ locals, request }: { locals: App.Locals; request: Request }) => {
		if (!locals.user) return fail(401, { message: 'Unauthorized' });

		const profile = await getUserProfileData(locals.user.id);
		const myClientId = profile.clientId;

		const payload = await request.formData();
		const data = Object.fromEntries(payload.entries()) as {
			employee_id: string;
			notes: string;
		};

		const ee = await getEmployee(data.employee_id);

		if (!ee) return { status: 404 };
		if (ee.clientId !== myClientId) return { status: 403 };

		try {
			await addEmployeeNote(data.employee_id, data.notes);
		} catch (err) {
			console.error(err);
			return { status: 500 };
		}

		return data;
	},
	save: async ({ locals, request }) => {
		if (!locals.user) return fail(401, { message: 'Unauthorized' });

		const profile = await getUserProfileData(locals.user.id);
		const clientId = profile?.clientId;

		const data = Object.fromEntries(await request.formData());
		const employeeId = data.employeeId as string;

		const emp = await getEmployee(employeeId, true, false);

		if (emp?.clientId !== clientId) error(403, { message: 'Unauthorized' });

		const campaigns: {
			employeeId: string;
			employeeCode: string;
			campaignId: string;
			isActive: boolean;
		}[] = [];

		for (const p in data) {
			if (p.startsWith('code|')) {
				const campaignId = p.split('|')[p.split('|').length - 1];
				const code = data[p] as string;

				if (!code) continue;

				campaigns.push({
					employeeId: data.employeeId as string,
					employeeCode: code,
					campaignId,
					isActive: true // no UI to support this currently
				});
			}
		}

		// sync campaigns for the employee
		const updatedEmployeeCodes = await upsertEmployeeCodes(campaigns);

		// todo: make the rest of the form update
		// need to implement the rest of this stuff... but for now, it updates the sales codes.... lol

		const overridesToEmployeeId = data.overridesToEmployeeId as string;

		if (overridesToEmployeeId) {
			await saveOverridingEmployee(employeeId, overridesToEmployeeId);
		}

		return data;
	}
};
