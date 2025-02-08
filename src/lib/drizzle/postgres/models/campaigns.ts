import { db } from '$lib/drizzle/postgres/client';
import type { InsertCampaign, SelectCampaign } from '$lib/drizzle/postgres/db.model';
import { and, eq } from 'drizzle-orm';
import { campaigns } from '../schema';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

const getCampaign = async (clientId: string, campaignId: string): Promise<SelectCampaign | null> => {
  if (!clientId || !campaignId) {
    return null;
  }
  
  const data = await db.query.campaigns.findFirst({
    where: (campaign, { and, eq }) => and(
      eq(campaign.clientId, clientId),
      eq(campaign.id, campaignId),
    ),
  });
  
  return data || null;
}

const getCampaigns = async (clientId: string): Promise<SelectCampaign[]> => {
  if (!clientId) {
    return [];
  }
  
  const data = await db.query.campaigns.findMany({
    where: (campaign, { eq }) => eq(campaign.clientId, clientId),
    orderBy: (campaign, { asc }) => [asc(campaign.name)],
  });
  
  return data || [];
}

const updateCampaign = async (campaign: InsertCampaign): Promise<SelectCampaign | null> => {
  if (!campaign) return null;
  const updated = dayjs().toDate();
  
  try {
    const current = await getCampaign(campaign.clientId, campaign.id);
    
    if (!current) return null;
    
    await db.update(campaigns)
      .set({
        name: campaign.name,
        description: campaign.description,
        url: campaign.url,
        active: campaign.active,
        updated,
      })
      .where(eq(campaigns.id, campaign.id));
  } catch (ex) {
    console.error(ex);
    return null;
  }
  
  return {
    id: campaign.id,
    clientId: campaign.clientId,
    name: campaign.name,
    description: campaign.description,
    url: campaign.url,
    active: campaign.active,
    updated,
  } as SelectCampaign;
}

const addCampaign = async (campaign: InsertCampaign): Promise<SelectCampaign | null> => {
  if (!campaign) return null;
  const updated = dayjs().toDate();
  
  const dto = {
    id: nanoid(),
    clientId: campaign.clientId,
    name: campaign.name,
    description: campaign.description,
    url: campaign.url,
    active: campaign.active,
    created: updated,
    updated,
  } as InsertCampaign;
  
  try {
    await db.insert(campaigns)
      .values(dto);
  } catch (ex) {
    console.error(ex);
    return null;
  }
  
  return dto as SelectCampaign;
}

export const addCampaigns = async (dtos: InsertCampaign[]): Promise<SelectCampaign[]> => {
  if (!dtos) return [];
  
  try {
    await db.insert(campaigns)
      .values(dtos);
    return dtos as SelectCampaign[];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export const disableCampaign = async (clientId: string, campaignId: string): Promise<boolean> => {
   try {
    await db.update(campaigns)
      .set({ active: false })
      .where(and(eq(campaigns.clientId, clientId), eq(campaigns.id, campaignId)));
    return true;
  } catch (ex) {
    console.error(ex);
    return false;
  }
}

export { getCampaign, getCampaigns, updateCampaign, addCampaign };