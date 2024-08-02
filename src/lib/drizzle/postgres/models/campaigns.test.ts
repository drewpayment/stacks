import { getCampaign, getCampaigns, updateCampaign, addCampaign, disableCampaign } from './campaigns';
import { drizzleClient } from '$lib/drizzle/postgres/client';
import { vi, describe, it, expect, beforeEach, afterAll } from 'vitest';
import type { InsertCampaign } from '../db.model';
import type { PgTable, TableConfig } from 'drizzle-orm/pg-core';

const campaignUpdateMockImplementation = (table: PgTable<TableConfig>) => {
  return {
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{ id: 'campaignId', clientId: 'clientId', name: 'Campaign' }] as any),
  } as any;
};

// Mock the drizzleClient
vi.mock('$lib/drizzle/postgres/client');

vi.spyOn(drizzleClient.query.campaigns, 'findMany')
  .mockResolvedValueOnce([{ id: 'campaignId', clientId: 'clientId', name: 'Campaign' } as any]);
  
vi.spyOn(drizzleClient.query.campaigns, 'findFirst')
  .mockResolvedValueOnce({ id: 'campaignId', clientId: 'clientId', name: 'Campaign' } as any)
  .mockResolvedValueOnce({ id: 'campaignId', clientId: 'clientId', name: 'Campaign' } as any)
  .mockResolvedValueOnce({ id: 'campaignId', clientId: 'clientId', name: 'Campaign' } as any);
  
vi.spyOn(drizzleClient, 'update')
  .mockImplementationOnce(campaignUpdateMockImplementation)
  .mockImplementationOnce(campaignUpdateMockImplementation)
  .mockRejectedValue(new Error('Test error'));

vi.spyOn(drizzleClient, 'insert').mockReturnValue({
  values: vi.fn().mockReturnThis(),
  returning: vi.fn().mockResolvedValue([{ id: 'campaignId', clientId: 'clientId', name: 'Campaign' }] as any),
} as any);

describe('campaigns', () => {
  
  afterAll(() => {
    vi.restoreAllMocks();
  });
  
  beforeEach(() => {
    // vi.clearAllMocks();
  });

  describe('getCampaign', () => {
    it('should return null if clientId or campaignId is not provided', async () => {
      const result = await getCampaign('', 'campaignId');
      expect(result).toBeFalsy();
    });

    it('should return the campaign if clientId and campaignId are provided', async () => {
      const mockCampaign = { id: 'campaignId', clientId: 'clientId', name: 'Campaign' };

      const result = await getCampaign('clientId', 'campaignId');
      expect(result).toEqual(mockCampaign);
    });
  });

  describe('getCampaigns', () => {
    it('should return an empty array if clientId is not provided', async () => {
      const result = await getCampaigns('');
      expect(result).toEqual([]);
    });

    it('should return campaigns if clientId is provided', async () => {
      const mockCampaigns = [{ id: 'campaignId', clientId: 'clientId', name: 'Campaign' }];

      const result = await getCampaigns('clientId');
      expect(result).toEqual(mockCampaigns);
    });
  });

  describe('updateCampaign', () => {
    it('should return null if campaign is not provided', async () => {
      const result = await updateCampaign(null as any);
      expect(result).toBeNull();
    });

    it('should update the campaign if it exists', async () => {
      const mockCampaign = { id: 'campaignId', clientId: 'clientId', name: 'Campaign' };

      const result = await updateCampaign(mockCampaign as any);
      expect(result).toEqual(expect.objectContaining(mockCampaign));
    });
  });

  describe('addCampaign', () => {
    it('should return null if campaign is not provided', async () => {
      const result = await addCampaign(null as any);
      expect(result).toBeNull();
    });

    it('should add the campaign', async () => {
      const mockCampaign = {
        clientId: 'clientId', 
        name: 'Campaign',
        active: true,
        description: 'Description',
        url: 'https://example.com',
      } as InsertCampaign;

      const result = await addCampaign(mockCampaign as any);
      expect(result).toMatchObject(mockCampaign);
    });
  });

  describe('disableCampaign', () => {
    it('should disable the campaign', async () => {
      const result = await disableCampaign('clientId', 'campaignId');
      expect(result).toBe(true);
    });

    it('should return false if an error occurs', async () => {
      const result = await disableCampaign('clientId', 'campaignId');
      expect(result).toBe(false);
    });
  });
});
