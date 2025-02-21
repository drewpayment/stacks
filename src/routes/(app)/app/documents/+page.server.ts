import { db } from '$lib/server/instantdb';

export const load = async () => {
  const getDocuments = async () => await db.query({ documents: {} });
  
  return {
    documents: await getDocuments(),
  }
};