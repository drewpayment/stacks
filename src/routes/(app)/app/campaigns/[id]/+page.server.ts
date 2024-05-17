import { getCampaign, updateCampaign } from '$lib/drizzle/postgres/models/campaigns';
import { getUserProfileData } from '$lib/drizzle/postgres/models/users';
import type { InsertCampaign } from '$lib/drizzle/postgres/db.model';
import type { Actions } from '@sveltejs/kit';


export const load = async ({ locals, params }) => {
  if (!locals.user) return { status: 401 };
  
  const campaign = async () => {
    const profile = await getUserProfileData(locals.user?.id);
    const clientId = profile.clientId;
    const data = await getCampaign(clientId as string, params.id);
    
    return data ? {
      ...data,
      created: Number(data?.created),
      updated: Number(data?.updated),
    } : null;
  }
  
  return {
    campaign: await campaign(),
  };
}

export const actions: Actions = {
  update: async ({ locals, request }) => {
    if (!locals.user) return { status: 401 };
    
    const profile = await getUserProfileData(locals.user.id);
    const clientId = profile.clientId;
    
    if (!clientId) return { status: 401 };
    
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries()) as { [key: string]: any };
    data.active = data.active === 'on';
    
    const res = await updateCampaign({
      ...data,
      clientId,
    } as InsertCampaign);
    
    return res;
  },
};