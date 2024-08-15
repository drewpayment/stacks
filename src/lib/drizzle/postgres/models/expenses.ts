import type { SelectEmployee, SelectExpenseItem, SelectExpenseReport, SelectPayrollCycle, SelectPaystub } from '../db.model';
import { drizzleClient as db } from '$lib/drizzle/postgres/client';

type ExpenseReportResult = SelectExpenseReport & { items: SelectExpenseItem[], employee: SelectEmployee, paystub: SelectPaystub & { payrollCycle: SelectPayrollCycle, }, };

export const getExpenseReports = async (clientId: string): Promise<ExpenseReportResult[]> => {
  let reports: ExpenseReportResult[];
  
  try {
    reports = await db.query.expenseReport.findMany({
      where: (expenseReport, { eq }) => eq(expenseReport.clientId, clientId),
      with: {
        items: true,
        employee: true,
        paystub: {
          with: {
            payrollCycle: true,
          },
        },
      },
    }) as ExpenseReportResult[];
  } catch (err) {
    console.error(err);
    return [] as ExpenseReportResult[];
  }
  
  return reports;
}

export const getExpenseReport = async (clientId: string, reportId: string): Promise<ExpenseReportResult | null> => {
  let report: ExpenseReportResult | null;
  
  try {
    report = await db.query.expenseReport.findFirst({
      where: (expenseReport, { eq, and }) => and(eq(expenseReport.clientId, clientId), eq(expenseReport.id, reportId)),
      with: {
        items: true,
        employee: true,
        paystub: {
          with: {
            payrollCycle: true,
          },
        },
      },
    }) as ExpenseReportResult | null;
  } catch (err) {
    console.error(err);
    return null;
  }
  
  return report;
}
