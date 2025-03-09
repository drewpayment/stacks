import { db } from '$lib/drizzle/postgres/client';
import type { SelectLocation } from '$lib/drizzle/postgres/db.model';
import { location } from '$lib/drizzle/postgres/schema';
import { type Actions, fail } from '@sveltejs/kit';
import { nanoid } from 'nanoid';


export const load = async () => {
  
  const getLocations = async () => (await db.query.location
    .findMany({
      where: (location, { isNull }) => isNull(location.deleted),
    })) as SelectLocation[];
  
  return {
    locations: await getLocations(),
  };
};

export const actions: Actions = {
  add: async ({ request, locals }) => {
    const form = await request.formData();
    const clientId = locals.user.profile.clientId;
    
    if (!clientId) return fail(405, { message: 'Incorrect client found' });
    
    const id = nanoid();
    const name = form.get('name') as string;
    const street = form.get('address') as string;
    const city = form.get('city') as string;
    const state = form.get('state') as string;
    const zip = form.get('zip') as string;
    const country = form.get('country') as string;
    const dto = {
      id,
      clientId,
      name,
      address: street,
      city,
      state,
      zip,
      country,
    };
    
    try {
      await db.insert(location)
        .values(dto)
    } catch (error) {
      console.log(error);
      return fail(400, error as any);
    }
    
    return dto;
  },
};