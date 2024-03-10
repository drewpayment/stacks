import { getEmployeeByUserId } from '$lib/drizzle/mysql/models/employees.js';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import { error, fail } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user) return fail(401, { message: 'Unauthorized' });
	
	const userId = locals.user.id;
	
	const profile = () => getUserProfileData(userId);
	const employee = async () => getEmployeeByUserId(userId);

	return {
		profile: await profile(),
		employee: await employee(),
	};
};
