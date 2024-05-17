import { getCampaigns } from '$lib/drizzle/postgres/models/campaigns';
import { getUserProfileData } from '$lib/drizzle/postgres/models/users';


export const load = async ({ locals, params }) => {  
  if (!locals.user) return { status: 401 };
  
  const campaigns = async () => {
    const profile = await getUserProfileData(locals.user!.id);
    const clientId = profile.clientId;
    const data = await getCampaigns(clientId as string)
    
    return data.map(campaign => ({
      ...campaign,
      created: Number(campaign.created),
      updated: Number(campaign.updated),
    }));
  };
  
  return {
    campaigns: await campaigns(),
  };
}