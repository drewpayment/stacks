import { getClient } from '$lib/drizzle/postgres/models/clients.js';
import { redirect } from '@sveltejs/kit';


export const load = async ({ params }) => {
  const id = params.id;
  
  if (!id) redirect(301, '/app/admin/client');
  
  const client = await getClient(id);
  
  if (!client) redirect(301, '/app/admin/client');
  
  return {
    client,
  };
};