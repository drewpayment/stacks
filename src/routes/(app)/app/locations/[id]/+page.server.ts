import { db } from '$lib/drizzle/postgres/client.js';
import { redirect } from '@sveltejs/kit';


export const load = async ({ params }) => {
  const id = params.id;
  
  if (!id) redirect(301, '/app/locations');
  
  const getLocation = async () => await db.query.location
    .findFirst({
      where: (location, { eq }) => eq(location.id, id),
    });
  
  return {
    location: await getLocation(),
  };
};