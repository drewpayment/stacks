import { getClients, upsertClient } from '$lib/drizzle/postgres/models/clients';
import { fail, redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) fail(401, { message: 'Unauthorized' });
	if (locals.user.profile.role !== 'super_admin') redirect(304, '/');

	return {
		clients: await getClients()
	};
};

export const actions: Actions = {
	add: async ({ locals, request }) => {
		if (!locals.user) return fail(401, { message: 'Unauthorized' });

		const payload = await request.formData();
		const data = Object.fromEntries(payload.entries()) as { name: string };

		try {
			await upsertClient({
				id: nanoid(),
				name: data.name,
				contactUserId: locals.user?.id,
				created: dayjs().toDate(),
				updated: dayjs().toDate()
			});
		} catch (err) {
			return fail(400, { error: err });
		}

		return { success: true };
	}
};
