import { getEmployeeByUserId } from '$lib/drizzle/mysql/models/employees.js';
import { getUserProfileData } from '$lib/drizzle/mysql/models/users';
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	
	if (!session) error(401, 'No session found. Please log in again.');
	const userId = session?.user.userId;
	
	const profile = () => getUserProfileData(userId);
	const employee = async () => getEmployeeByUserId(userId);

	return {
		profile: await profile(),
		employee: await employee(),
	};
};
