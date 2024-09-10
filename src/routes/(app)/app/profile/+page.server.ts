import { updateOwnUserProfile } from '$lib/drizzle/postgres/models/users';
import { fail, type Actions } from '@sveltejs/kit';
import { request } from 'http';

export const load = async ({ locals }) => {
	if (!locals.user) return fail(401, { message: 'Unauthorized' });
	
	const userAvatar = async () => locals.appwrite.getUserImage(locals.user.id);

	return {
		profile: locals.user.profile,
		userAvatarBuffer: await userAvatar(),
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
	uploadProfilePhoto: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { message: 'Unauthorized' });
		
		const userId = locals.user.id;
		const formData = Object.fromEntries(await request.formData());
		
		const photo = formData['profile_photo'];
		
		if (!photo) return fail(400, { message: 'No photo provided' });
		
		
	},
};