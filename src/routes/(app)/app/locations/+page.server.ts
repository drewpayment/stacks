import { db } from '$lib/drizzle/postgres/client';
import type { SelectLocation } from '$lib/drizzle/postgres/db.model';



export const load = async () => {
  
  const getLocations = async () => (await db.query.location
    .findMany({
      where: (location, { isNull }) => isNull(location.deleted),
    })) as SelectLocation[];
  
  return {
    locations: await getLocations(),
  };
};