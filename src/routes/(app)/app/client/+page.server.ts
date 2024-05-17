import { getClients, createClient } from '$lib/drizzle/postgres/models/clients';
import { fail, json } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

export const load = async ({ locals }) => {
  if (!locals.user) fail(401, { message: 'Unauthorized' });

  return {
    clients: await getClients(),
  };
};

export const actions = {
  add: async ({ locals, request }) => {
    if (!locals.user) fail(401, { message: 'Unauthorized' });
    const payload = await request.formData();
    const data = Object.fromEntries(payload.entries()) as { name: string };
    
    try {
      await createClient({
        id: nanoid(),
        name: data.name,
        contactUserId: locals.user?.id,
        created: Date.now() as any,
        updated: Date.now() as any,
      });
    } catch (err) {
      return {
        status: false,
        body: json({ error: err }),
      };
    }
    
    return { success: true, };
  }
}