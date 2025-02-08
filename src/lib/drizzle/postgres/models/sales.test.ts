import { vi, describe, it, expect, afterAll } from 'vitest';
import {
  toInsertSale,
  toClientDto,
  getUnallocatedSalesByEmployee,
} from './sales';
import { db } from '../client';
import dayjs from 'dayjs';
import type { InsertSale, SelectSale } from '../db.model';

//#region Mock Data
const TESTDATA = {
  singleInsert: {
    id: 'test-id',
    clientId: 'client-id',
    campaignId: 'campaign-id',
    saleDate: new Date('2022-01-01'),
    saleAmount: '100',
    statusDescription: 'approved',
    isComplete: true,
    employeeId: 'employee-id',
    customerFirstName: 'John',
    customerLastName: 'Doe',
    customerAddress: '123 Main St',
    created: dayjs(1640995200000).toDate(),
    updated: dayjs(1640995200000).toDate(),
  } as InsertSale,
  singleSelect: {
    id: 'test-id',
    clientId: 'client-id',
    campaignId: 'campaign-id',
    saleDate: new Date('2022-01-01'),
    saleAmount: '100',
    statusDescription: 'approved',
    isComplete: true,
    employeeId: 'employee-id',
    customerFirstName: 'John',
    customerLastName: 'Doe',
    customerAddress: '123 Main St',
    created: dayjs(1640995200000).toDate(),
    updated: dayjs(1640995200000).toDate(),
  } as SelectSale,
  salesList: [
    {
      id: 'test-id-1',
      clientId: 'client-id',
      campaignId: 'campaign-id',
      saleDate: new Date('2022-01-01'),
      saleAmount: '100',
      statusDescription: 'accepted',
      isComplete: true,
      employeeId: 'employee-id',
      customerFirstName: 'John',
      customerLastName: 'Doe',
      customerAddress: '123 Main St',
      created: dayjs(1640995200000).toDate(),
      updated: dayjs(1640995200000).toDate(),
    },
    {
      id: 'test-id-2',
      clientId: 'client-id',
      campaignId: 'campaign-id',
      saleDate: new Date('2022-01-02'),
      saleAmount: '200',
      statusDescription: 'pending',
      isComplete: false,
      employeeId: 'employee-id',
      customerFirstName: 'Jane',
      customerLastName: 'Doe',
      customerAddress: '456 Main St',
      created: dayjs(1640995200000).toDate(),
      updated: dayjs(1640995200000).toDate(),
    },
  ] as SelectSale[],
};
//#endregion

vi.mock('../client');

vi.spyOn(db.query.sale, 'findMany')
  .mockResolvedValueOnce(TESTDATA.salesList)

describe('sales', () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('toInsertSale', () => {
    it('should convert data to InsertSale', () => {
      const data = {
        id: 'test-id',
        client_id: 'client-id',
        campaign_id: 'campaign-id',
        sale_date: '2022-01-01',
        sale_amount: 100,
        status_description: 'accepted',
        is_complete: true,
        employee_id: 'employee-id',
        customer_first_name: 'John',
        customer_last_name: 'Doe',
        customer_address: '123 Main St',
        created: 1640995200000,
        updated: 1640995200000,
      };

      const result = toInsertSale(data);

      expect(result).toEqual({
        id: 'test-id',
        clientId: 'client-id',
        campaignId: 'campaign-id',
        saleDate: dayjs(data.sale_date).toDate(),
        saleAmount: 100,
        statusDescription: 'accepted',
        isComplete: true,
        employeeId: 'employee-id',
        customerFirstName: 'John',
        customerLastName: 'Doe',
        customerAddress: '123 Main St',
        created: 1640995200000,
        updated: 1640995200000,
      });
    });
  });

  describe('toClientDto', () => {
    it('should convert data to SaleDto', () => {
      const data = {
        id: 'test-id',
        clientId: 'client-id',
        campaignId: 'campaign-id',
        saleDate: new Date('2022-01-01'),
        saleAmount: '100',
        statusDescription: 'approved',
        isComplete: true,
        employeeId: 'employee-id',
        customerFirstName: 'John',
        customerLastName: 'Doe',
        customerAddress: '123 Main St',
        created: dayjs(1640995200000).toDate(),
        updated: dayjs(1640995200000).toDate(),
      } as SelectSale;

      const result = toClientDto(data);

      expect(result).toEqual({
        id: 'test-id',
        client_id: 'client-id',
        campaign_id: 'campaign-id',
        sale_date: dayjs(data.saleDate).toDate(),
        sale_amount: 100,
        status_description: 'approved',
        is_complete: true,
        employee_id: 'employee-id',
        created: 1640995200000,
        updated: 1640995200000,
        customer_first_name: 'John',
        customer_last_name: 'Doe',
        customer_address: '123 Main St',
      });
    });
  });

  // describe('saveSale', () => {
  //   it('should save a sale and return SelectSale', async () => {
  //     const dto = {
  //       id: 'test-id',
  //       clientId: 'client-id',
  //       campaignId: 'campaign-id',
  //       saleDate: new Date('2022-01-01'),
  //       saleAmount: '100',
  //       statusDescription: 'approved',
  //       isComplete: true,
  //       employeeId: 'employee-id',
  //       customerFirstName: 'John',
  //       customerLastName: 'Doe',
  //       customerAddress: '123 Main St',
  //       created: dayjs(1640995200000).toDate(),
  //       updated: dayjs(1640995200000).toDate(),
  //     } as InsertSale;

  //     const result = await saveSale(dto);

  //     expect(drizzleClient.insert).toHaveBeenCalledWith(sale);
  //     expect(drizzleClient.insert(sale)).toHaveBeenCalledWith({ ...dto });
  //     expect(result).toMatchObject(dto);
  //   });

  //   it('should handle error and return null', async () => {
  //     const dto = {
  //       id: 'test-id',
  //       clientId: 'client-id',
  //       campaignId: 'campaign-id',
  //       saleDate: new Date('2022-01-01'),
  //       saleAmount: 100,
  //       statusDescription: 'accepted',
  //       isComplete: true,
  //       employeeId: 'employee-id',
  //       customerFirstName: 'John',
  //       customerLastName: 'Doe',
  //       customerAddress: '123 Main St',
  //       created: 1640995200000,
  //       updated: 1640995200000,
  //     };

  //     vi.spyOn(console, 'error').mockImplementation(() => {});
  //     drizzleClient.insert.mockRejectedValueOnce(new Error('Test error'));

  //     const result = await saveSale(dto);

  //     expect(drizzleClient.insert).toHaveBeenCalledWith(sale);
  //     expect(drizzleClient.insert).toHaveBeenCalledWith({ ...dto });
  //     expect(console.error).toHaveBeenCalledWith(new Error('Test error'));
  //     expect(result).toBeNull();
  //   });
  // });

  // describe('saveSales', () => {
  //   it('should save multiple sales and return SelectSale[]', async () => {
  //     const dtos = [
  //       {
  //         id: 'test-id-1',
  //         clientId: 'client-id',
  //         campaignId: 'campaign-id',
  //         saleDate: new Date('2022-01-01'),
  //         saleAmount: 100,
  //         statusDescription: 'accepted',
  //         isComplete: true,
  //         employeeId: 'employee-id',
  //         customerFirstName: 'John',
  //         customerLastName: 'Doe',
  //         customerAddress: '123 Main St',
  //         created: 1640995200000,
  //         updated: 1640995200000,
  //       },
  //       {
  //         id: 'test-id-2',
  //         clientId: 'client-id',
  //         campaignId: 'campaign-id',
  //         saleDate: new Date('2022-01-02'),
  //         saleAmount: 200,
  //         statusDescription: 'pending',
  //         isComplete: false,
  //         employeeId: 'employee-id',
  //         customerFirstName: 'Jane',
  //         customerLastName: 'Doe',
  //         customerAddress: '456 Main St',
  //         created: 1640995200000,
  //         updated: 1640995200000,
  //       },
  //     ];

  //     const result = await saveSales(dtos);

  //     expect(drizzleClient.insert).toHaveBeenCalledWith(sale);
  //     expect(drizzleClient.insert).toHaveBeenCalledWith(dtos);
  //     expect(result).toEqual(dtos);
  //   });

  //   it('should handle error and throw an error', async () => {
  //     const dtos = [
  //       {
  //         id: 'test-id-1',
  //         clientId: 'client-id',
  //         campaignId: 'campaign-id',
  //         saleDate: new Date('2022-01-01'),
  //         saleAmount: 100,
  //         statusDescription: 'accepted',
  //         isComplete: true,
  //         employeeId: 'employee-id',
  //         customerFirstName: 'John',
  //         customerLastName: 'Doe',
  //         customerAddress: '123 Main St',
  //         created: 1640995200000,
  //         updated: 1640995200000,
  //       },
  //       {
  //         id: 'test-id-2',
  //         clientId: 'client-id',
  //         campaignId: 'campaign-id',
  //         saleDate: new Date('2022-01-02'),
  //         saleAmount: 200,
  //         statusDescription: 'pending',
  //         isComplete: false,
  //         employeeId: 'employee-id',
  //         customerFirstName: 'Jane',
  //         customerLastName: 'Doe',
  //         customerAddress: '456 Main St',
  //         created: 1640995200000,
  //         updated: 1640995200000,
  //       },
  //     ];

  //     vi.spyOn(console, 'error').mockImplementation(() => {});
  //     drizzleClient.insert.mockRejectedValueOnce(new Error('Test error'));

  //     await expect(saveSales(dtos)).rejects.toThrowError('Test error');
  //     expect(drizzleClient.insert).toHaveBeenCalledWith(sale);
  //     expect(drizzleClient.insert).toHaveBeenCalledWith(dtos);
  //     expect(console.error).toHaveBeenCalledWith(new Error('Test error'));
  //   });
  // });

  describe('getUnallocatedSalesByEmployee', () => {
    it('should return unallocated sales for an employee', async () => {
      const salesData = TESTDATA.salesList;
      const result = await getUnallocatedSalesByEmployee('clientId', 'campaignId', 'employeeId');

      expect(result).toEqual(salesData);
    });
  });

  // describe('processImport', () => {
  //   it('should process imported sales data', async () => {
  //     const importedSales = [
  //       {
  //         sales_code: 'code1',
  //         sale_date: '2022-01-01',
  //         sale_amount: '100',
  //         status_description: 'accepted',
  //         customer_first_name: 'John',
  //         customer_last_name: 'Doe',
  //         customer_address: '123 Main St',
  //       },
  //       {
  //         sales_code: 'code2',
  //         sale_date: '2022-01-02',
  //         sale_amount: '200',
  //         status_description: 'pending',
  //         customer_first_name: 'Jane',
  //         customer_last_name: 'Doe',
  //         customer_address: '456 Main St',
  //       },
  //     ] as ImportRow[];

  //     const employeeId = 'employee-id';
  //     const campaignId = 'campaign-id';
  //     const clientId = 'client-id';

  //     vi.mocked(getEmployeeIdByCampaignSalesCode).mockResolvedValueOnce(employeeId);

  //     const result = await processImport(clientId, campaignId, importedSales);

  //     expect(getEmployeeIdByCampaignSalesCode).toHaveBeenCalledWith(importedSales[0].sales_code);
  //     expect(result).toEqual(importedSales.map(toClientDto));
  //   });
  // });
});
