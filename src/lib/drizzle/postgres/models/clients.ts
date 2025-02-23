import { db } from '$lib/drizzle/postgres/client';
import type { SelectClient } from '$lib/drizzle/postgres/db.model';
import { client } from '../schema';


const getClients = async (): Promise<SelectClient[]> => {
  const data = await db.query.client.findMany() as SelectClient[];
  return data;
}

export const getClient = async (clientId: string): Promise<SelectClient> => {
  try {
    const data = await db.query.client.findFirst({
      where: (client, { eq }) => eq(client.id, clientId),
    });
    
    return data as SelectClient;
  } catch (error) {
    console.error(error);
    return null as unknown as SelectClient;
  }
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