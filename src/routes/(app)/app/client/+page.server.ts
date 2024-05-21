import { getClients, createClient } from '$lib/drizzle/postgres/models/clients';
import { fail } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

export const load = async ({ locals }) => {
  if (!locals.user) fail(401, { message: 'Unauthorized' });

  return {
    clients: await getClients(),
  };
};

export const actions = {
  add: async ({ locals, request }) => {
    if (!locals.user) return fail(401, { message: 'Unauthorized' });
    
    const payload = await request.formData();
    const data = Object.fromEntries(payload.entries()) as { name: string };
    
    try {
      await createClient({
        id: nanoid(),
        name: data.name,
        contactUserId: locals.user?.id,
        created: dayjs().toDate(),
        updated: dayjs().toDate(),
      });
    } catch (err) {
      return fail(400, { error: err });
    }
    
    return { success: true, };
  }
}