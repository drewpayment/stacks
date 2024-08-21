import type {
	SelectExpenseReport,
	SelectExpenseItem,
	SelectEmployee,
	SelectPaystub,
	SelectPayrollCycle
} from '../db.model';

export type ExpenseReportResult = SelectExpenseReport & {
	items: SelectExpenseItem[];
	employee: SelectEmployee;
	paystub: SelectPaystub & { payrollCycle: SelectPayrollCycle };
};
