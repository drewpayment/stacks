import { relations } from 'drizzle-orm';
import { bigint, boolean, datetime, double, int, mysqlEnum, mysqlTable, primaryKey, text, tinyint, unique, varchar } from 'drizzle-orm/mysql-core';

export const user = mysqlTable('auth_user', {
	id: varchar('id', { length: 255 }).primaryKey(),
	email: varchar('email', { length: 255 }).unique().notNull(),
	emailVerified: boolean('email_verified').default(false).notNull(),

	// From GitHub
	githubUsername: varchar('github_username', { length: 255 }).unique(),
});

export const userSession = mysqlTable('user_session', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expiresAt: datetime('expires_at').notNull(),
});

export const userProfile = mysqlTable('user_profile', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.unique()
		.notNull()
		.references(() => user.id),

	clientId: varchar('client_id', { length: 255 })
		.references(() => client.id),
	role: mysqlEnum('role', ['user', 'supervisor', 'admin', 'org_admin', 'super_admin'])
		.default('user')
		.notNull(),

	// From Google
	firstName: varchar('first_name', { length: 255 }),
	lastName: varchar('last_name', { length: 255 }),
	picture: varchar('picture', { length: 1024 })
});

export const password = mysqlTable('password', {
	id: int('id').autoincrement().primaryKey(),
	hashedPassword: varchar('hashed_password', { length: 255 }).notNull(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
});

export const passwordResetToken = mysqlTable('password_reset_token', {
	id: int('id').autoincrement().primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expires: bigint('expires', { mode: 'number' }).notNull()
});

export const oauthAccount = mysqlTable('oauth_account', {
	providerId: varchar('provider_id', { length: 255 }).notNull(),
	providerUserId: varchar('provider_user_id', { length: 255 }).notNull(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
}, (table) => ({
	pk: primaryKey(table.providerId, table.providerUserId),
}));

export const employee = mysqlTable('employee', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.unique()
		.references(() => user.id),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	firstName: varchar('first_name', { length: 255 }).notNull(),
	lastName: varchar('last_name', { length: 255 }).notNull(),
	created: bigint('created', { mode: 'number' }).notNull(),
	updated: bigint('updated', { mode: 'number' }).notNull(),
	deleted: bigint('deleted', { mode: 'number' }),
	isCommissionable: tinyint('is_commissionable').notNull().default(0),
});

export const overridingEmployee = mysqlTable('overriding_employee', {
	id: varchar('id', { length: 255 }).primaryKey(),
	employeeId: varchar('employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	overridesEmployeeId: varchar('overrides_employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	overrideAmount: double('override_amount').notNull().default(0),
});

export const employeeRelations = relations(employee, ({ many, one }) => ({
	employeeProfile: one(employeeProfile, {
		fields: [employee.id],
		references: [employeeProfile.employeeId],
	}),
	employeeCodes: many(employeeCodes),
	employeeNotes: many(employeeNotes),
	overrideTo: one(overridingEmployee, {
		fields: [employee.id],
		references: [overridingEmployee.overridesEmployeeId],
	}),
}));

export const employeeProfile = mysqlTable('employee_profile', {
	id: varchar('id', { length: 255 }).primaryKey(),
	employeeId: varchar('employee_id', { length: 255 })
		.unique()
		.notNull()
		.references(() => employee.id),
	address: varchar('address', { length: 255 }).notNull(),
	address2: varchar('address_2', { length: 255 }),
	city: varchar('city', { length: 255 }).notNull(),
	state: varchar('state', { length: 255 }).notNull(),
	zip: varchar('zip', { length: 255 }).notNull(),
	phone: varchar('phone', { length: 255 }).notNull(),
	phone2: varchar('phone_2', { length: 255 }),
	email: varchar('email', { length: 255 }).notNull(),
});

export const employeeNotes = mysqlTable('employee_notes', {
	id: varchar('id', { length: 255 }).primaryKey(),
	employeeId: varchar('employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	note: text('note').notNull(),
	created: bigint('created', { mode: 'number' }).notNull(),
})

export const employeeNotesRelations = relations(employeeNotes, ({ one }) => ({
	employee: one(employee, {
		fields: [employeeNotes.employeeId],
		references: [employee.id],
	}),
}));

export const employeeCodes = mysqlTable('employee_codes', {
	id: varchar('id', { length: 255 }).primaryKey(),
	employeeId: varchar('employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	campaignId: varchar('campaign_id', { length: 255 })
		.notNull()
		.references(() => campaigns.id)
		.default(''),
	employeeCode: varchar('employee_code', { length: 255 }).notNull(),
	isActive: boolean('is_active').default(false).notNull(),
}, (t) => ({
	unq: unique().on(t.employeeId, t.employeeCode),
}));

export const employeeCodesRelations = relations(employeeCodes, ({ one }) => ({
	employee: one(employee, {
		fields: [employeeCodes.employeeId],
		references: [employee.id],
	}),
}));

export const emailVerification = mysqlTable('email_verification', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expires: bigint('expires', { mode: 'number' }).notNull()
});

export const userKey = mysqlTable('user_key', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	hashedPassword: varchar('hashed_password', { length: 255 })
});

export const client = mysqlTable('client', {
	id: varchar('id', { length: 255 }).primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	contactUserId: varchar('contact_user_id', { length: 255 })
		.references(() => user.id),
	created: bigint('created', { mode: 'number' }).notNull(),
	updated: bigint('updated', { mode: 'number' }).notNull(),
	deleted: bigint('deleted', { mode: 'number' }),
});

export const campaigns = mysqlTable('campaigns', {
	id: varchar('id', { length: 255 }).primaryKey(),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	name: varchar('name', { length: 255 }).notNull(),
	url: varchar('url', { length: 255 }).default(''),
	description: text('description').default(''),
	active: boolean('active').default(false).notNull(),
	created: bigint('created', { mode: 'number' }).notNull(),
	updated: bigint('updated', { mode: 'number' }).notNull(),
});

export const payrollCycle = mysqlTable('payroll_cycle', {
	id: varchar('id', { length: 255 }).primaryKey(),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	startDate: bigint('start_date', { mode: 'number' }).notNull(),
	endDate: bigint('end_date', { mode: 'number' }).notNull(),
	paymentDate: bigint('payment_date', { mode: 'number' }).notNull(),
	created: bigint('created', { mode: 'number' }).notNull(),
	updated: bigint('updated', { mode: 'number' }).notNull(),
	deleted: bigint('deleted', { mode: 'number' }),
	isClosed: tinyint('is_closed').notNull().default(0),
});

export const paystub = mysqlTable('paystub', {
	id: varchar('id', { length: 255 }).primaryKey(),
	employeeId: varchar('employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	payrollCycleId: varchar('payroll_cycle_id', { length: 255 })
		.default('')
		.references(() => payrollCycle.id),
	campaignId: varchar('campaign_id', { length: 255 })
		.notNull()
		.references(() => campaigns.id),
	totalSales: bigint('total_sales', { mode: 'number' }).notNull(),
	totalOverrides: bigint('total_overrides', { mode: 'number' }).notNull(),
	pieceRate: double('piece_rate').notNull(),
	grossPay: double('gross_pay').notNull(),
	netPay: double('net_pay').notNull(),
	taxDeductions: double('tax_deductions').notNull().default(0),
	otherDeductions: double('other_deductions').notNull().default(0),
	created: bigint('created', { mode: 'number' }).notNull(),
	updated: bigint('updated', { mode: 'number' }).notNull(),
	deleted: bigint('deleted', { mode: 'number' }),
});

export const paystubRelations = relations(paystub, ({ one, many }) => ({
	employee: one(employee, {
		fields: [paystub.employeeId],
		references: [employee.id],
	}),
	sales: many(sale),
	campaign: one(campaigns, {
		fields: [paystub.campaignId],
		references: [campaigns.id],
	}),
	payrollCycle: one(payrollCycle, {
		fields: [paystub.payrollCycleId],
		references: [payrollCycle.id],
	}),
	client: one(client, {
		fields: [paystub.clientId],
		references: [client.id],
	}),
	overrides: many(saleOverride),
}));

export const sale = mysqlTable('sale', {
	id: varchar('id', { length: 255 }).primaryKey(),
	employeeId: varchar('employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	paystubId: varchar('paystub_id', { length: 255 })
		.default('')
		.references(() => paystub.id),
	campaignId: varchar('campaign_id', { length: 255 })
		.notNull()
		.references(() => campaigns.id),
	saleDate: bigint('sale_date', { mode: 'number' }).notNull(),
	customerFirstName: varchar('customer_first_name', { length: 255 }).notNull(),
	customerLastName: varchar('customer_last_name', { length: 255 }).notNull(),
	customerAddress: varchar('customer_address', { length: 255 }).notNull(),
	saleAmount: double('sale_amount').notNull().default(0),
	isComplete: tinyint('is_complete').notNull().default(0),
	statusDescription: mysqlEnum('status_description', ['pending', 'approved', 'rejected']).notNull(),
	created: bigint('created', { mode: 'number' }).notNull(),
	updated: bigint('updated', { mode: 'number' }).notNull(),
	deleted: bigint('deleted', { mode: 'number' }),
});

export const saleRelations = relations(sale, ({ one }) => ({
	paystub: one(paystub, {
		fields: [sale.paystubId],
		references: [paystub.id],
	}),
	campaign: one(campaigns, {
		fields: [sale.campaignId],
		references: [campaigns.id],
	}),
	employee: one(employee, {
		fields: [sale.employeeId],
		references: [employee.id],
	}),
}));

export const saleOverride = mysqlTable('sale_override', {
	id: varchar('id', { length: 255 }).primaryKey(),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	originatingSaleId: varchar('sale_id', { length: 255 })
		.references(() => sale.id),
	originatingEmployeeId: varchar('originating_employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	beneficiaryEmployeeId: varchar('beneficiary_employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	overrideAmount: double('override_amount').notNull().default(0),
	paidOnPaystubId: varchar('paid_on_paystub_id', { length: 255 })
		.references(() => paystub.id),
});

export const saleOverrideRelations = relations(saleOverride, ({ one }) => ({
	paystub: one(paystub, {
		fields: [saleOverride.paidOnPaystubId],
		references: [paystub.id],
	}),
	sale: one(sale, {
		fields: [saleOverride.originatingSaleId],
		references: [sale.id],
	}),
}));

export const expenseReport = mysqlTable('expense_report', {
	id: varchar('id', { length: 255 }).primaryKey(),
	employeeId: varchar('employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	paystubId: varchar('paystub_id', { length: 255 })
		.notNull()
		.references(() => paystub.id),
	submissionDate: bigint('submission_date', { mode: 'number' }).notNull(),
	approvalStatus: mysqlEnum('approval_status', ['pending', 'approved', 'rejected']).notNull(),
	approvalDate: bigint('approval_date', { mode: 'number' }),
	approvalNotes: text('approval_notes'),
	totalAmount: double('total_amount').notNull().default(0),
	created: bigint('created', { mode: 'number' }).notNull(),
	updated: bigint('updated', { mode: 'number' }).notNull(),
	deleted: bigint('deleted', { mode: 'number' }),
});

export const expenseItem = mysqlTable('expense_item', {
	id: varchar('id', { length: 255 }).primaryKey(),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	exportReportId: varchar('expense_report_id', { length: 255 })
		.notNull()
		.references(() => expenseReport.id),
	description: text('description').notNull(),
	amount: double('amount').notNull().default(0),
	dateIncurred: bigint('date_incurred', { mode: 'number' }).notNull(),
	receiptUrl: varchar('receipt_url', { length: 1024 }),
});

