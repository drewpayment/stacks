// import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
// import {
//   getPaystubs,
//   getPaystubById,
//   getPaystubsWoPayrollCycle,
//   getPaystubsByPayrollCycleId,
//   detachPayrollCycleFromPaystubs,
//   detachPayrollCycleFromPaystub,
//   detachPaystubFromPayrollCycles,
//   attachPayrollCycleToPaystub,
//   numberOfPaystubsByPayrollCycleId,
//   generatePendingPaystub,
//   insertPaystub,
// } from './paystubs';
// import { drizzleClient } from '../client';
// import { paystub } from '../schema';
// import { error } from '@sveltejs/kit';
// import { nanoid } from 'nanoid';
// import dayjs from 'dayjs';

// vi.mock('../client');
// vi.mock('@sveltejs/kit');
// vi.mock('nanoid');
// vi.mock('dayjs');

// describe('paystubs', () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   describe('getPaystubs', () => {
//     it('should return an empty array if clientId is not provided', async () => {
//       const result = await getPaystubs('', 0, 0);
//       expect(result).toEqual([]);
//     });

//     // Add more tests for different scenarios
//   });

//   describe('getPaystubById', () => {
//     it('should return null if clientId or paystubId is not provided', async () => {
//       const result = await getPaystubById('', '');
//       expect(result).toBeNull();
//     });

//     // Add more tests for different scenarios
//   });

//   describe('getPaystubsWoPayrollCycle', () => {
//     it('should return an empty array if clientId is not provided', async () => {
//       const result = await getPaystubsWoPayrollCycle('', 0, 0);
//       expect(result).toEqual([]);
//     });

//     // Add more tests for different scenarios
//   });

//   describe('getPaystubsByPayrollCycleId', () => {
//     it('should return an empty array if payrollCycleId is not provided', async () => {
//       const result = await getPaystubsByPayrollCycleId('', '');
//       expect(result).toEqual([]);
//     });

//     // Add more tests for different scenarios
//   });

//   describe('detachPayrollCycleFromPaystubs', () => {
//     it('should return false if payrollCycleId is not provided', async () => {
//       const result = await detachPayrollCycleFromPaystubs('');
//       expect(result).toBe(false);
//     });

//     // Add more tests for different scenarios
//   });

//   describe('detachPayrollCycleFromPaystub', () => {
//     it('should return false if paystubId is not provided', async () => {
//       const result = await detachPayrollCycleFromPaystub('');
//       expect(result).toBe(false);
//     });

//     // Add more tests for different scenarios
//   });

//   describe('detachPaystubFromPayrollCycles', () => {
//     it('should return false if paystubId is not provided', async () => {
//       const result = await detachPaystubFromPayrollCycles('');
//       expect(result).toBe(false);
//     });

//     // Add more tests for different scenarios
//   });

//   describe('attachPayrollCycleToPaystub', () => {
//     it('should return false if paystubId or payrollCycleId is not provided', async () => {
//       const result = await attachPayrollCycleToPaystub('', '');
//       expect(result).toBe(false);
//     });

//     // Add more tests for different scenarios
//   });

//   describe('numberOfPaystubsByPayrollCycleId', () => {
//     it('should return 0 if payrollCycleId is not provided', async () => {
//       const result = await numberOfPaystubsByPayrollCycleId('');
//       expect(result).toBe(0);
//     });

//     // Add more tests for different scenarios
//   });
  
//   describe('generatePendingPaystub', () => {
//     it('should return a pending paystub with the provided clientId, employeeId, and campaignId', () => {
//       const clientId = 'client123';
//       const employeeId = 'employee456';
//       const campaignId = 'campaign789';

//       const mockNanoid = vi.spyOn(nanoid, 'nanoid').mockReturnValue('mockId');
//       const mockDayjs = vi.spyOn(dayjs, 'default').mockReturnValue({
//         toDate: vi.fn().mockReturnThis(),
//       });

//       const result = generatePendingPaystub(clientId, employeeId, campaignId);

//       expect(result).toEqual({
//         id: 'mockId',
//         clientId,
//         employeeId,
//         campaignId,
//         payrollCycleId: null,
//         totalSales: 0,
//         totalOverrides: 0,
//         grossPay: '0',
//         netPay: '0',
//         pieceRate: '0',
//         otherDeductions: '0',
//         taxDeductions: '0',
//         created: expect.any(Date),
//         updated: expect.any(Date),
//       });

//       expect(mockNanoid).toHaveBeenCalled();
//       expect(mockDayjs).toHaveBeenCalledTimes(2);
//     });
//   });

//   describe('insertPaystub', () => {
//     it('should return null if dto is not provided', async () => {
//       const result = await insertPaystub(null);
//       expect(result).toBeNull();
//     });

//     it('should insert the paystub into the database and return the dto', async () => {
//       const dto = {
//         id: 'paystub123',
//         clientId: 'client123',
//         employeeId: 'employee456',
//         campaignId: 'campaign789',
//         // other properties
//       };

//       const mockInsert = vi.spyOn(drizzleClient, 'insert').mockReturnValue({
//         values: vi.fn().mockResolvedValue(undefined),
//       });

//       const result = await insertPaystub(dto);

//       expect(result).toEqual(dto);
//       expect(mockInsert).toHaveBeenCalledWith(paystub);
//       expect(mockInsert().values).toHaveBeenCalledWith(dto);
//     });

//     it('should throw an error and call error function if there is an error inserting the paystub', async () => {
//       const dto = {
//         id: 'paystub123',
//         clientId: 'client123',
//         employeeId: 'employee456',
//         campaignId: 'campaign789',
//         // other properties
//       };

//       const mockInsert = vi.spyOn(drizzleClient, 'insert').mockReturnValue({
//         values: vi.fn().mockRejectedValue(new Error('Database error')),
//       });

//       const mockError = vi.spyOn(error, 'error');

//       await insertPaystub(dto);

//       expect(mockError).toHaveBeenCalledWith(500, 'Error saving paystub');
//     });
//   });
  
// });
