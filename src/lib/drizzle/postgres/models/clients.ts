import { db } from '$lib/drizzle/postgres/client';
import type { InsertClient, SelectClient } from '$lib/drizzle/postgres/db.model';
import { eq } from 'drizzle-orm';
import { client } from '../schema';


export const getClients = async (): Promise<SelectClient[]> => {
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

export const upsertClient = async (clientData: Partial<InsertClient>) => {
  try {
    const clientId = clientData.id;
    
    if (!clientId) {
      throw new Error('No valid Client ID provided.');
    }
  
    await db.transaction(async (tx) => {    
      const data = await tx.query.client.findFirst({
        where: (client, { eq }) => eq(client.id, clientId),
      });
        
      if (data) {
        await tx.update(client)
          .set(clientData)
          .where(eq(client.id, clientId));
      } else {
        await tx.insert(client)
          .values(clientData as InsertClient);
      }
    });
    
    return clientData;
  } catch (error) {
    
    console.error(error);
    return null;
  }
}
