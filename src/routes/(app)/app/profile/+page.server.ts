import type { UserImage } from '$lib/appwrite/models/user-image.model.js';
import { updateOwnUserProfile } from '$lib/drizzle/postgres/models/users';
import { fail, type Actions } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { request } from 'http';
import { nanoid } from 'nanoid';

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
		
		const photos = formData['profile_photos'] as unknown as FileList;
		if (!photos || photos.length === 0) return fail(400, { message: 'No photo provided' });
		const photo = photos[0];
		
		if (!photo) return fail(400, { message: 'No photo provided' });
		
		const now = dayjs().toDate();
		
		const dto = {
			id: nanoid(),
			userId,
			fileName: `profile-photo-${userId}.${photo.type.split('/')[1]}`,
			created: now,
			updated: now,
		} as UserImage;
		
		try {
			const res = await locals.appwrite.saveUserImage(dto, photo);
			
			return res;
		} catch (err) {
			return fail(400, { message: 'Error uploading photo' });
		}
	},
};