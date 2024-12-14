import { inArray } from 'drizzle-orm';
import { legacyDb } from '../client'
import type { SelectLegacyVendor } from '../db.model';
import { legacyVendors } from '../schema';



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

export const disableVendors = async (vendorIds: number[]): Promise<void> => {
  try {
    await legacyDb.update(legacyVendors)
      .set({ isActive: 0 })
      .where(inArray(legacyVendors.id, vendorIds));
  } catch (err) {
    console.error(err);
    throw err;
  }
}