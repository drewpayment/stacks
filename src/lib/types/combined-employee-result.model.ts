import type { SelectLegacyEmployee } from '$lib/drizzle/mysql/db.model';
import type { Employee } from '$lib/drizzle/postgres/db.model';


export type CombinedEmployeeResult = (Partial<Employee> | Partial<SelectLegacyEmployee>) & {
  legacy?: boolean;
};