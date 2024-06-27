import { getClients } from '$lib/drizzle/postgres/models/clients';

export const load = async ({ locals }) => {
	return {
		user: locals?.user,
		profile: locals?.user?.profile,
		clients: await getClients(),
	};
};
