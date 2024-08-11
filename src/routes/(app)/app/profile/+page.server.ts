import { getEmployeeByUserId } from '$lib/drizzle/postgres/models/employees.js';
import { getUserProfileData, updateOwnUserProfile } from '$lib/drizzle/postgres/models/users';
import { error, fail, type Actions } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user) return fail(401, { message: 'Unauthorized' });
	
	const userId = locals.user.id;
	
	const profile = () => getUserProfileData(userId);

	return {
		profile: await profile(),
	};
};

export const actions: Actions = {
	edit: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { message: 'Unauthorized' });
		
		const userId = locals.user.id;
		const formData = Object.fromEntries(await request.formData());
		
		try {
			await updateOwnUserProfile({
				userId: userId,
				...formData,
			});
		} catch (err: any) {
			return fail(400, { message: err?.message, });
		}
	},
};