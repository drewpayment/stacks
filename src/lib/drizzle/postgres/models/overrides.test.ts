import { vi, describe, it, expect, afterAll } from 'vitest';
import { db } from '../client';
import { getPendingSaleOverrides, saveOverridingEmployee } from './overrides';
import type { SelectSaleOverride } from '../db.model';

vi.mock('$lib/drizzle/postgres/client');

vi.spyOn(db.query.saleOverride, 'findMany')
  .mockRejectedValueOnce(new Error('test error'))
  .mockResolvedValueOnce([{ id: 'testId', clientId: 'clientId',  } as SelectSaleOverride]);
  
vi.spyOn(db.query.overridingEmployee, 'findFirst')
  .mockResolvedValueOnce({ id: 'testId' } as any)
  


describe('overrides', () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('getPendingSaleOverrides', () => {
    it('should return an empty array if employeeId is not provided', async () => {
      const result = await getPendingSaleOverrides('');
      expect(result).toEqual([]);
    });

    it('should return an empty array if an error occurs', async () => {
      const result = await getPendingSaleOverrides('testId');
      expect(result).toEqual([]);
    });

    it('should return the correct data if no error occurs', async () => {
      const result = await getPendingSaleOverrides('testId');
      expect(result).toEqual([{ id: 'testId', clientId: 'clientId', }]);
    });
  });

  describe('saveOverridingEmployee', () => {
    it('should return false if employeeId or overridesToEmployeeId is not provided', async () => {
      const result = await saveOverridingEmployee('', '');
      expect(result).toBe(false);
    });

    it('should return true if an existing override is found', async () => {
      const result = await saveOverridingEmployee('testId', 'testOverridesToEmployeeId');
      expect(result).toBe(true);
    });

    // not sure how to test this case
    // it('should return false if an error occurs', async () => {
    //   const mockFindFirst = vi.fn().mockResolvedValue(null);
    //   const mockInsert = vi.fn().mockRejectedValue(new Error('test error'));
    //   vi.mocked(drizzleClient.query.overridingEmployee).findFirst = mockFindFirst;
    //   vi.mocked(drizzleClient).insert = mockInsert;

    //   const result = await saveOverridingEmployee('testId', 'testOverridesToEmployeeId');
    //   expect(result).toBe(false);
    // });

    // it('should return true if no error occurs', async () => {
    //   const mockFindFirst = vi.fn().mockResolvedValue(null);
    //   const mockInsert = vi.fn().mockResolvedValue({ id: 'testId' });
    //   vi.mocked(drizzleClient.query.overridingEmployee).findFirst = mockFindFirst;
    //   vi.mocked(drizzleClient).insert = mockInsert;

    //   const result = await saveOverridingEmployee('testId', 'testOverridesToEmployeeId');
    //   expect(result).toBe(true);
    // });
  });

});