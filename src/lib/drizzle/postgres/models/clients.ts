import { drizzleClient as db } from '$lib/drizzle/postgres/client';
import type { SelectClient } from '$lib/drizzle/mysql/db.model';
import { client } from '../schema';


const getClients = async (): Promise<SelectClient[]> => {
  const data = await db.query.client.findMany() as SelectClient[];
  return data;
}

const createClient = async (clientData: typeof client.$inferInsert) => {
  await db
    .insert(client)
    .values(clientData)
    .onConflictDoUpdate({
      target: client.id,
      set: Object.fromEntries(
        Object.entries(clientData).filter(([key]) => !['id'].includes(key))
      )
    });
}

export { getClients, createClient };