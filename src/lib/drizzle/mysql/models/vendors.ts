import { legacyDb } from '../client'
import type { SelectLegacyVendor } from '../db.model';



export const getVendors = async (): Promise<SelectLegacyVendor[]> => {
  try {
    const results = await legacyDb.query.legacyVendors.findMany({
      where: (legacyVendors, { eq }) => eq(legacyVendors.isActive, 1),
    });
    return results;
  } catch (err) {
    console.error(err);
    return [];
  }
}