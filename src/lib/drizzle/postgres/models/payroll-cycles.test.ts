import { vi, describe, it, expect, afterAll } from 'vitest';
import { getPayrollCycles, getPayrollCycle, addPayrollCycle, togglePayrollCycleClose } from './payroll-cycles';
import { drizzleClient } from '../client';
import type { SelectPayrollCycle } from '../db.model';

vi.mock('../client');

vi.spyOn(drizzleClient.query.payrollCycle, 'findMany')
  .mockResolvedValueOnce([{ id: '1', clientId: 'clientid1', } as SelectPayrollCycle])
  .mockResolvedValueOnce([{ id: '1', clientId: 'test', startDate: 12345, isClosed: false } as SelectPayrollCycle]);
  
vi.spyOn(drizzleClient.query.payrollCycle, 'findFirst')
  .mockResolvedValueOnce({ id: '1', clientId: 'test', startDate: 12345, isClosed: false } as SelectPayrollCycle);

describe('payroll-cycles', () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('getPayrollCycles', () => {
    it('should return an empty array if clientId is not provided', async () => {
      const result = await getPayrollCycles('');
      expect(result).toEqual([]);
    });

    it('should return payroll cycles for a given clientId', async () => {
      const mockData = [{ id: '1', clientId: 'clientid1', }];
      const result = await getPayrollCycles('test');
      expect(result).toEqual(mockData);
    });

    it('should return payroll cycles for a given clientId excluding closed cycles', async () => {
      const mockData = [{ id: '1', clientId: 'test', startDate: 12345, isClosed: false }];
      const result = await getPayrollCycles('test', false);
      expect(result).toEqual(mockData);
    });
  });

  describe('getPayrollCycle', () => {
    it('should return null if id is not provided', async () => {
      const result = await getPayrollCycle('');
      expect(result).toBeNull();
    });

    it('should return a payroll cycle for a given id', async () => {
      const mockData = { id: '1', clientId: 'test', startDate: 12345, isClosed: false };
      const result = await getPayrollCycle('1');
      expect(result).toEqual(mockData);
    });
  });

  // describe('addPayrollCycle', () => {
  //   it('should return null if dto is not provided', async () => {
  //     const result = await addPayrollCycle(null);
  //     expect(result).toBeNull();
  //   });

  //   it('should add a payroll cycle and return the added cycle', async () => {
  //     const mockDto = { clientId: 'test', startDate: new Date(), isClosed: false };
  //     drizzleClient.insert.mockResolvedValue(mockDto);

  //     const result = await addPayrollCycle(mockDto);
  //     expect(result).toEqual(mockDto);
  //   });
  // });

  // describe('togglePayrollCycleClose', () => {
  //   it('should return false if id is not provided', async () => {
  //     const result = await togglePayrollCycleClose('', 'true');
  //     expect(result).toBe(false);
  //   });

  //   it('should toggle the isClosed status of a payroll cycle', async () => {
  //     const result = await togglePayrollCycleClose('1', 'true');
  //     expect(result).toBe(true);
  //   });
  // });
});
