import { CMP_CLIENT_ID } from '$env/static/private';
import { disableVendors, getVendors } from '$lib/drizzle/mysql/models/vendors';
import type { InsertCampaign, SelectCampaign } from '$lib/drizzle/postgres/db.model';
import { addCampaigns } from '$lib/drizzle/postgres/models/campaigns';
import { nanoid } from 'nanoid';



export const importLegacyVendorsToCampaigns = async (clientId: string, campaigns: SelectCampaign[]): Promise<SelectCampaign[]> => {
  if (clientId !== CMP_CLIENT_ID) return Promise.resolve(campaigns);
  
  const vendors = await getVendors();
  const pendingCampaigns: InsertCampaign[] = [];
  const vendorsToDisable: number[] = [];
  
  vendors.forEach(vendor => {
    const exists = campaigns.find(campaign => campaign.importedId === `${vendor.id}`);
    
    if (!exists) {
      pendingCampaigns.push({
        id: nanoid(),
        clientId,
        name: vendor.name,
        importedId: `${vendor.id}`,
        url: '',
        description: 'Imported from legacy site.',
        active: true,
        created: new Date(),
        updated: new Date(),
      });
      vendorsToDisable.push(vendor.id);
    }
  });
  
  if (pendingCampaigns.length) {
    try {
      const added = await addCampaigns(pendingCampaigns);
      await disableVendors(vendorsToDisable);
      
      campaigns.push(...added);
    } catch (err) {
      console.error(err);
      return campaigns;
    }
  }
  
  return [...campaigns];
}