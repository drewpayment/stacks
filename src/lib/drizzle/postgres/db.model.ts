import type { campaigns, client, employee, employeeCodes, employeeNotes, employeeProfile, expenseItem, expenseReport, location, overridingEmployee, payrollCycle, paystub, sale, saleOverride, team, user, userKey, userProfile, userSession } from './schema';


export type InsertUserKey = typeof userKey.$inferInsert;
export type UpdateUserKey = InsertUserKey;
export type SelectUserKey = typeof userKey.$inferSelect;

export type InsertUserSession = typeof userSession.$inferInsert;
export type UpdateUserSession = Partial<InsertUserSession>;
export type SelectUserSession = typeof userSession.$inferSelect;

export type InsertUser = typeof user.$inferInsert;
export type UpdateUser = InsertUser;
export type SelectUser = typeof user.$inferSelect;

export type InsertUserProfile = typeof userProfile.$inferInsert;
export type UpdateUserProfile = InsertUserProfile;
export type SelectUserProfile = typeof userProfile.$inferSelect;

export type RoleTypes = "user" | "supervisor" | "admin" | "org_admin" | "super_admin" | undefined;

export type UserProfile = SelectUserProfile & { client: SelectClient };
export type User = { auth_user: SelectUser, user_profile: SelectUserProfile };
export type CurrentUser = import('../../server/auth/types').User & { profile: UserProfile & { client: SelectClient } };

export type SelectClient = typeof client.$inferSelect;
export type InsertClient = typeof client.$inferInsert;

export type SelectEmployee = typeof employee.$inferSelect;
export type SelectEmployeeProfile = typeof employeeProfile.$inferSelect;
export type EmployeeProfile = SelectEmployeeProfile;
export type SelectEmployeeCodes = typeof employeeCodes.$inferSelect;
export type Employee = SelectEmployee & { employeeProfile: SelectEmployeeProfile, employeeCodes: SelectEmployeeCodes[], overrideTo: SelectOverridingEmployee };
export type SelectEmployeeNotes = typeof employeeNotes.$inferSelect;
export type EmployeeWithNotes = Employee & { employeeNotes: SelectEmployeeNotes[] };
export type InsertEmployeeNotes = typeof employeeNotes.$inferInsert;
export type InsertEmployee = typeof employee.$inferInsert;
export type InsertEmployeeProfile = typeof employeeProfile.$inferInsert;
export type InsertEmployeeCode = typeof employeeCodes.$inferInsert;
export type SelectEmployeeCode = typeof employeeCodes.$inferSelect;
export type SelectCampaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

export type SelectPaystub = typeof paystub.$inferSelect;
export type InsertPaystub = typeof paystub.$inferInsert;

export type SelectPayrollCycle = typeof payrollCycle.$inferSelect;
export type InsertPayrollCycle = typeof payrollCycle.$inferInsert;

export type SelectOverridingEmployee = typeof overridingEmployee.$inferSelect;
export type InsertOverridingEmployee = typeof overridingEmployee.$inferInsert;
export type SelectSaleOverride = typeof saleOverride.$inferSelect;
export type InsertSaleOverride = typeof saleOverride.$inferInsert;

export type InsertExpenseItem = typeof expenseItem.$inferInsert;
export type InsertExpenseReport = typeof expenseReport.$inferInsert;
export type SelectExpenseReport = typeof expenseReport.$inferSelect;
export type SelectExpenseItem = typeof expenseItem.$inferSelect;

export type SelectSale = typeof sale.$inferSelect;
export type InsertSale = typeof sale.$inferInsert;
export interface SaleDto {
  id: string;
  client_id: string;
  campaign_id: string;
  sale_amount: number;
  sale_date: number;
  status_description: string;
  is_complete: boolean;
  employee_id: string;
  created: Date;
  updated: Date;
  customer_first_name: string;
  customer_last_name: string;
  customer_address: string;
}

export type SelectLocation = typeof location.$inferSelect;
export type InsertLocation = typeof location.$inferInsert;

export type SelectTeam = typeof team.$inferSelect;
export type InsertTeam = typeof team.$inferInsert;