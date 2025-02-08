import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getEmployees, getEmployee, createEmployee, updateEmployee } from './employees';
import { db } from '$lib/drizzle/postgres/client';
import { employee } from '../schema';
import type { InsertEmployee, InsertEmployeeProfile, SelectEmployee } from '$lib/drizzle/postgres/db.model';

vi.mock('$lib/drizzle/postgres/client');

vi.spyOn(db.query.employee, 'findMany')
  .mockResolvedValueOnce([{ id: '1', clientId: 'client1' } as SelectEmployee])
  .mockRejectedValueOnce(new Error('Test error'));
  
vi.spyOn(db.query.employee, 'findFirst')
  .mockResolvedValueOnce({ id: '1', clientId: 'client1' } as SelectEmployee)
  .mockResolvedValueOnce({} as SelectEmployee);
  
vi.spyOn(db, 'insert').mockReturnThis();
  
vi.spyOn(db, 'update')
  .mockReturnValueOnce({} as any)
  .mockRejectedValueOnce(new Error('Test error'));

describe('Employees', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getEmployees', () => {
    it('should return an empty array if clientId is not provided', async () => {
      const result = await getEmployees('');
      expect(result).toEqual([]);
    });

    it('should return an array of employees if clientId is provided', async () => {
      const mockEmployees = [{ id: '1', clientId: 'client1' }];
      const result = await getEmployees('client1');
      expect(result).toEqual(mockEmployees);
    });

    it('should return an empty array if an error occurs', async () => {
      const result = await getEmployees('client1');
      expect(result).toEqual([]);
    });
  });

  describe('getEmployee', () => {
    it('should return null if employeeId is not provided', async () => {
      const result = await getEmployee('');
      expect(result).toBeNull();
    });

    it('should return an employee if employeeId is provided', async () => {
      const mockEmployee = { id: '1', clientId: 'client1' };
      const result = await getEmployee('employee1');
      expect(result).toEqual(mockEmployee);
    });
  });

  describe('createEmployee', () => {
    // I don't know how to mock the drizzleClient.insert method to return a success or failure
    // it('should create an employee and employee profile', async () => {
    //   const mockEmployeeData = { id: '1', clientId: 'client1' } as InsertEmployee;
    //   const mockEmployeeProfileData = { employeeId: '1', email: 'john@email.com' } as InsertEmployeeProfile;
    //   await createEmployee(mockEmployeeData, mockEmployeeProfileData);
      
    //   expect(drizzleClient.insert).toHaveBeenCalledWith(employee, mockEmployeeData);
    //   expect(drizzleClient.insert).toHaveBeenCalledWith(employee, mockEmployeeProfileData);
    //   // expect(result).toEqual({ success: true });
    // });

    it('should return an error if creating an employee fails', async () => {
      const mockEmployeeData = { id: '1', clientId: 'client1' } as InsertEmployee;
      const mockEmployeeProfileData = { employeeId: '1', email: 'john@email.com' } as InsertEmployeeProfile;
      const result = await createEmployee(mockEmployeeData, mockEmployeeProfileData);
      expect(result).toEqual({ success: false });
    });
  });

  describe('updateEmployee', () => {
    // I don't know how to mock the drizzleClient.insert method to return a success or failure
    // it('should update an employee', async () => {
    //   const mockEmployeeData = { id: '1', clientId: 'client2' } as InsertEmployee;
    //   const result = await updateEmployee(mockEmployeeData);
    //   expect(result).toEqual({ success: true });
    // });

    it('should return an error if updating an employee fails', async () => {
      const mockEmployeeData = { id: '1', clientId: 'client2' } as InsertEmployee;
      const result = await updateEmployee(mockEmployeeData);
      expect(result).toEqual({ success: false });
    });
  });
});