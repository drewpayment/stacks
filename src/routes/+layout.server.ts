import { getClients } from '$lib/drizzle/postgres/models/clients';
import { getUserProfileData } from '$lib/drizzle/postgres/models/users';

export const load = async ({ locals }) => {
	const profile = await getUserProfileData(locals.user?.id);

	return {
		user: locals?.user,
		profile,
		clients: await getClients(),
	};
};
