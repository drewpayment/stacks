// Import necessary modules and functions
import { vi, describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest';
import { db } from '$lib/drizzle/postgres/client';
import { getClients, createClient } from './clients';
import { client } from '../schema';
import type { SelectClient } from '../db.model';

// Mock data for testing
const mockClients = [
  { id: 'clientid', name: 'Client 1', contactUserId: 'userid', created: new Date(), updated: new Date() },
  { id: 'clientid', name: 'Client 2', contactUserId: 'userid', created: new Date(), updated: new Date() },
] as SelectClient[];

const mockClientData = { id: 'clientid', name: 'Client 1', contactUserId: 'userid' } as {
  id: string;
  name: string;
  created: Date;
  updated: Date;
  contactUserId?: string | null | undefined;
  deleted?: Date | null | undefined;
};

// Mock the database query function
vi.mock('$lib/drizzle/postgres/client');

vi.spyOn(db.query.client, 'findMany')
  .mockResolvedValueOnce(mockClients)
  .mockResolvedValueOnce([]);
  
vi.spyOn(db, 'insert').mockReturnValue({
  values: vi.fn().mockReturnThis(),
  onConflictDoUpdate: vi.fn().mockReturnThis(),
  returning: vi.fn().mockResolvedValue(mockClientData),
} as any);

// Describe the test suite for the clients module
describe('clients', () => {
  
  afterAll(() => {
    vi.restoreAllMocks();
  });

  // Test the getClients function
  describe('getClients', () => {
    it('should return an array of clients', async () => {
      // Call the function and assert the result
      const result = await getClients();
      expect(result).toEqual(mockClients);
    });

    it('should handle an empty database', async () => {
      // Call the function and assert the result
      const result = await getClients();
      expect(result).toEqual([]);
    });
  });

  // Test the createClient function
  describe('createClient', () => {
    it('should insert a new client', async () => {
      // Call the function
      await createClient(mockClientData);

      // Assert that the database insert function was called with the correct arguments
      expect(db.insert).toHaveBeenCalledOnce();
    });
  });
});
