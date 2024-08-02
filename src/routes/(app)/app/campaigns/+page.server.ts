import { disableCampaign, getCampaigns } from '$lib/drizzle/postgres/models/campaigns';
import { fail, type Actions } from '@sveltejs/kit';


export const load = async ({ locals, params }) => {  
  if (!locals.user) return { status: 401 };
  
  const campaigns = async () => {
    const clientId = locals.user.profile.clientId;
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

export const actions: Actions = {
  updateActive: async ({ request, locals, }) => {
    if (!locals.user) return fail(401, { message: 'Not authorized.' });
    
    try {
      const clientId = locals.user.profile.clientId;
      const formData = await request.formData();
      const data = Object.fromEntries(formData.entries());
      const { campaignId } = data;
      
      // todo: this should actually toggle the active state, so that the frontend doesn't need to know whether it is 
      // active or not initially... 
      await disableCampaign(clientId as string, campaignId as string);
    } catch (err) {
      return fail(500, { message: 'Failed to disable the campaign.' });
    }
    
     return { success: true };
  }
};