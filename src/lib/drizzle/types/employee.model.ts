import type { employee, employeeProfile } from '../postgres/schema';



export interface IEmployee {
  employee: typeof employee.$inferSelect;
  employeeProfile: typeof employeeProfile.$inferSelect;
}