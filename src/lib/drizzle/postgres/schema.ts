import { relations } from 'drizzle-orm';
import { bigint, boolean, decimal, foreignKey, index, integer, jsonb, pgEnum, pgTable, primaryKey, text, timestamp, unique, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import type { TeamManager } from '../types/team.model';
import type { OnboardingRequirements } from './types/onboarding.model';

export const user = pgTable('auth_user', {
	id: varchar('id', { length: 255 }).primaryKey(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull().default(false),
}).enableRLS();

export const userRoleEnum = pgEnum('user_role', ['user', 'supervisor', 'admin', 'org_admin', 'super_admin']);

export const userClient = pgTable('user_client', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
}, (table) => ({
	unique: [table.userId, table.clientId],
})).enableRLS();

export const userClientRelations = relations(userClient, ({ one }) => ({
	user: one(user, {
		fields: [userClient.userId],
		references: [user.id],
		relationName: 'user_client_user_fk',
	}),
	client: one(client, {
		fields: [userClient.clientId],
		references: [client.id],
		relationName: 'user_client_client_fk',
	}),
}));

export const userProfile = pgTable('user_profile', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.unique()
		.notNull()
		.references(() => user.id),
	clientId: varchar('client_id', { length: 255 })
		.references(() => client.id),
	role: userRoleEnum('role').notNull().default('user'),

	// From Google
	firstName: varchar('first_name', { length: 255 }),
	lastName: varchar('last_name', { length: 255 }),
	picture: varchar('picture', { length: 1024 }),

	address: varchar('address', { length: 255 }),
	address2: varchar('address_2', { length: 255 }),
	city: varchar('city', { length: 255 }),
	state: varchar('state', { length: 2 }),
	zip: varchar('zip', { length: 10 }),
}).enableRLS();

export const userProfileRelations = relations(userProfile, ({ one }) => ({
	user: one(user, {
		fields: [userProfile.userId],
		references: [user.id],
		relationName: 'user_profile_user_fk',
	}),
	client: one(client, {
		fields: [userProfile.clientId],
		references: [client.id],
		relationName: 'user_profile_client_fk',
	}),
}));

export const emailVerification = pgTable('email_verification', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expires: timestamp('expires').notNull()
}).enableRLS();

export const password = pgTable('password', {
	id: text('id').primaryKey(),
	hashedPassword: text('hashed_password').notNull(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
}).enableRLS();

export const passwordResetToken = pgTable('password_reset_token', {
	id: text('id').primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expires: timestamp('expires').notNull()
}).enableRLS();

export const userSession = pgTable('user_session', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { mode: 'string' }).notNull(),
}).enableRLS();

export const oauthAccount = pgTable('oauth_account', {
	providerId: text('provider_id').notNull(),
	providerUserId: text('provider_user_id').notNull(),
	userId: text('user_id').notNull().references(() => user.id),
}, (table) => ([
	primaryKey({
		columns: [table.providerId, table.providerUserId],
	}),
])).enableRLS();

export const employeeStatusEnum = pgEnum('employee_status', [
	'full_time',
	'part_time',
	'hired_unassigned',
	'candidate',
	'ready_to_hire',
	'onboarding',
	'leave_of_absense',
	'terminated',
	'short_term_disability',
	'long_term_disability',
]);

export const employee = pgTable('employee', {
	id: text('id').primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.unique()
		.references(() => user.id),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	isCommissionable: boolean('is_commissionable').notNull().default(false),
	status: employeeStatusEnum('status').notNull().default('hired_unassigned'),
	created: timestamp('created').notNull().$default(() => new Date(Date.now())),
	updated: timestamp('updated').notNull().$default(() => new Date(Date.now())),
	deleted: timestamp('deleted'),
}).enableRLS();

export const employeeProfile = pgTable('employee_profile', {
	id: text('id').primaryKey(),
	employeeId: varchar('employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	address: text('address').notNull(),
	address2: text('address_2'),
	city: text('city').notNull(),
	state: text('state').notNull(),
	zip: text('zip').notNull(),
	phone: text('phone').notNull(),
	phone2: text('phone_2'),
	email: text('email').notNull(),
}).enableRLS();

export const employeeNotes = pgTable('employee_notes', {
	id: varchar('id', { length: 255 }).primaryKey(),
	employeeId: varchar('employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	note: text('note').notNull(),
	created: timestamp('created').notNull().$default(() => new Date(Date.now())),
}).enableRLS()

export const employeeNotesRelations = relations(employeeNotes, ({ one }) => ({
	employee: one(employee, {
		fields: [employeeNotes.employeeId],
		references: [employee.id],
	}),
}));

export const employeeCodes = pgTable('employee_codes', {
	employeeId: text('employee_id')
		.notNull(),
	campaignId: text('campaign_id')
		.notNull()
		.references(() => campaigns.id),
	employeeCode: varchar('employee_code', { length: 255 }).notNull(),
	isActive: boolean('is_active').default(false).notNull(),
}, (t) => ({
	pk: primaryKey(t.employeeId, t.employeeCode),
	parentReference: foreignKey({
		columns: [t.employeeId],
		foreignColumns: [employee.id],
	}),
	// unq: unique().on(t.employeeId, t.employeeCode),
})).enableRLS();

export const employeeCodesRelations = relations(employeeCodes, ({ one }) => ({
	employee: one(employee, {
		fields: [employeeCodes.employeeId],
		references: [employee.id],
		relationName: 'employee_codes_employee_fk',
	}),
}));

export const overridingEmployee = pgTable('overriding_employee', {
	id: text('id').primaryKey(),
	employeeId: varchar('employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	overridesEmployeeId: varchar('overriding_employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	overrideAmount: decimal('override_amount', { precision: 10, scale: 2 }).notNull()
		.default("0.00"),
}).enableRLS();

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

export const userKey = pgTable('user_key', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	hashedPassword: varchar('hashed_password', { length: 255 })
}).enableRLS();

export const client = pgTable('client', {
	id: varchar('id', { length: 255 }).primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	contactUserId: varchar('contact_user_id', { length: 255 })
		.references(() => user.id),

	slug: varchar('slug', { length: 255 }).notNull().unique(),

	// Business Information
	legalName: varchar('legal_name', { length: 255 }),
	taxId: varchar('tax_id', { length: 50 }),
	industry: varchar('industry', { length: 100 }),

	// Contact Information
	primaryContactName: varchar('primary_contact_name', { length: 255 }),
	primaryContactEmail: varchar('primary_contact_email', { length: 255 }),
	primaryContactPhone: varchar('primary_contact_phone', { length: 50 }),

	// Billing Information
	billingAddress: jsonb('billing_address'),  // Structured address data
	billingEmail: varchar('billing_email', { length: 255 }),

	// Tenant Configuration
	subdomain: varchar('subdomain', { length: 63 }).unique(),
	timezone: varchar('timezone', { length: 100 }).notNull().default('UTC'),
	locale: varchar('locale', { length: 15 }).notNull().default('en-US'),

	// Feature Flags & Limits
	maxUsers: integer('max_users').notNull().default(10),
	featuresEnabled: jsonb('features_enabled').notNull().default('{}'),

	// Subscription & Status
	subscriptionTier: varchar('subscription_tier', { length: 50 }).notNull().default('standard'),
	isActive: boolean('is_active').notNull().default(true),
	trialEndsAt: timestamp('trial_ends_at'),

	created: timestamp('created').notNull().$default(() => new Date(Date.now())),
	updated: timestamp('updated').defaultNow().notNull(),
	deleted: timestamp('deleted'),
}, (table) => [
	uniqueIndex('idx_client_subdomain_name').on(table.subdomain),
]).enableRLS();

export const campaigns = pgTable('campaigns', {
	id: varchar('id', { length: 255 }).primaryKey(),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	name: varchar('name', { length: 255 }).notNull(),
	importedId: varchar('imported_id', { length: 255 }).default(''),
	url: varchar('url', { length: 255 }).default(''),
	description: text('description').default(''),
	active: boolean('active').default(false).notNull(),
	created: timestamp('created').notNull().$default(() => new Date(Date.now())),
	updated: timestamp('updated').notNull().$default(() => new Date(Date.now())),
}).enableRLS();

export const payrollCycle = pgTable('payroll_cycle', {
	id: varchar('id', { length: 255 }).primaryKey(),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	startDate: timestamp('start_date').notNull(),
	endDate: timestamp('end_date').notNull(),
	paymentDate: timestamp('payment_date').notNull(),
	created: timestamp('created').notNull().$default(() => new Date(Date.now())),
	updated: timestamp('updated').notNull().$default(() => new Date(Date.now())),
	deleted: timestamp('deleted'),
	isClosed: boolean('is_closed').notNull().default(false),
}).enableRLS();

export const payrollCycleRelations = relations(payrollCycle, ({ many }) => ({
	paystubs: many(paystub),
}));

export const paystub = pgTable('paystub', {
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
	pieceRate: decimal('piece_rate').notNull(),
	grossPay: decimal('gross_pay').notNull(),
	netPay: decimal('net_pay').notNull(),
	taxDeductions: decimal('tax_deductions').notNull().default("0.00"),
	otherDeductions: decimal('other_deductions').notNull().default("0.00"),
	created: timestamp('created').notNull().$default(() => new Date(Date.now())),
	updated: timestamp('updated').notNull().$default(() => new Date(Date.now())),
	deleted: timestamp('deleted'),
}).enableRLS();

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

export const statusDescriptionEnum = pgEnum('status_description', ['pending', 'approved', 'rejected']);

export const sale = pgTable('sale', {
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
	saleDate: timestamp('sale_date').notNull(),
	customerFirstName: varchar('customer_first_name', { length: 255 }).notNull(),
	customerLastName: varchar('customer_last_name', { length: 255 }).notNull(),
	customerAddress: varchar('customer_address', { length: 255 }).notNull(),
	saleAmount: decimal('sale_amount').notNull().default("0.00"),
	isComplete: boolean('is_complete').notNull().default(false),
	statusDescription: statusDescriptionEnum('status_description').notNull().default('rejected'),
	created: timestamp('created').notNull().$default(() => new Date(Date.now())),
	updated: timestamp('updated').notNull().$default(() => new Date(Date.now())),
	deleted: timestamp('deleted'),
}).enableRLS();

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

export const saleOverride = pgTable('sale_override', {
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
	overrideAmount: decimal('override_amount').notNull().default("0.00"),
	paidOnPaystubId: varchar('paid_on_paystub_id', { length: 255 })
		.references(() => paystub.id),
}).enableRLS();

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

export const approvalStatusEnum = pgEnum('approval_status', ['pending', 'approved', 'rejected']);

export const expenseCategoryEnum = pgEnum('expense_category', ['travel', 'meals', 'supplies', 'equipment', 'vehicles', 'utilities',
	'rent', 'marketing', 'professional_development', 'subscriptions', 'insurance', 'professional_services', 'repairs', 'shipping',
	'employee_benefits', 'taxes_licenses', 'interest_bank_fees', 'misc',
]);

export const expenseReport = pgTable('expense_report', {
	id: varchar('id', { length: 255 }).primaryKey(),
	employeeId: varchar('employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	paystubId: varchar('paystub_id', { length: 255 })
		.references(() => paystub.id),
	submissionDate: timestamp('submission_date').notNull(),
	approvalStatus: approvalStatusEnum('approval_status').notNull().default('pending'),
	approvalDate: timestamp('approval_date'),
	approvalNotes: text('approval_notes'),
	totalAmount: decimal('total_amount').notNull().default("0.00"),
	created: timestamp('created').notNull().$default(() => new Date(Date.now())),
	updated: timestamp('updated').notNull().$default(() => new Date(Date.now())),
	deleted: timestamp('deleted'),
}).enableRLS();

export const expenseItem = pgTable('expense_item', {
	id: varchar('id', { length: 255 }).primaryKey(),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	expenseReportId: varchar('expense_report_id', { length: 255 })
		.notNull()
		.references(() => expenseReport.id),
	category: expenseCategoryEnum('category').notNull().default('misc'),
	description: text('description').notNull(),
	amount: decimal('amount').notNull().default("0.00"),
	date: timestamp('date_incurred').notNull(),
}).enableRLS();

export const expenseItemRelations = relations(expenseItem, ({ one }) => ({
	expenseReport: one(expenseReport, {
		fields: [expenseItem.expenseReportId],
		references: [expenseReport.id],
	}),
}));

export const expenseReportRelations = relations(expenseReport, ({ one, many }) => ({
	employee: one(employee, {
		fields: [expenseReport.employeeId],
		references: [employee.id],
		relationName: 'expenseReportEmployee',
	}),
	items: many(expenseItem),
	paystub: one(paystub, {
		fields: [expenseReport.paystubId],
		references: [paystub.id],
	}),
}));

export const location = pgTable('location', {
	id: varchar('id', { length: 255 }).unique(),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	name: varchar('name', { length: 200 })
		.notNull(),
	address: varchar('address', { length: 200 }),
	city: varchar('city', { length: 200 }),
	state: varchar('state', { length: 200 }),
	zip: varchar('zip', { length: 200 }),
	country: varchar('country', { length: 200 }),
	created: timestamp('created').notNull().$default(() => new Date(Date.now())),
	updated: timestamp('updated').notNull().$default(() => new Date(Date.now())),
	deleted: timestamp('deleted'),
}, (table) => [
	primaryKey({ columns: [table.id, table.clientId] }),
]).enableRLS();

export const team = pgTable('team', {
	id: varchar('id', { length: 255 }).primaryKey(),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	isBroker: boolean().default(false),
	name: varchar('name', { length: 200 }),
	generalManager: jsonb('general_manager')
		.$type<TeamManager>()
		.default({} as TeamManager),
	regionalManager: jsonb('regional_manager')
		.$type<TeamManager>()
		.default({} as TeamManager),
	teamMemberEmployeeIds: jsonb('team_member_employee_ids')
		.$type<string[]>()
		.default([]),
	locationId: varchar('location_id', { length: 255 })
		.references(() => location.id),
	created: timestamp('created').notNull().$default(() => new Date(Date.now())),
	updated: timestamp('updated').notNull().$default(() => new Date(Date.now())),
	deleted: timestamp('deleted'),
}, (table) => [
	unique('idx_client_id_name').on(table.id, table.name),
]).enableRLS();

export const stepCategoryEnum = pgEnum('step_category', [
  'personal', 
  'documents',
  'it_setup',
  'training',
  'compliance',
  'benefits',
  'general'
]);

export const stepStatusEnum = pgEnum('step_status', [
  'not_started',
  'in_progress',
  'completed',
  'rejected',
  'skipped'
]);

export const assigneeTypeEnum = pgEnum('assignee_type', [
  'employee',
  'hr',
  'manager',
  'it',
  'finance',
  'department_head'
]);

export const fieldTypeEnum = pgEnum('field_type', [
  'text',
  'number',
  'date',
  'email',
  'phone',
  'select',
  'checkbox',
  'radio',
  'textarea',
  'file_upload'
]);

export const workflowTemplate = pgTable('onboarding_workflow_templates', {
	id: varchar('id', { length: 255 }).primaryKey(),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	name: text('name').notNull(),
	description: text('description'),
	isDefault: boolean('is_default').default(false).notNull(),
	isSystem: boolean('is_system').default(false).notNull(),
	category: text('category'),
	created: timestamp('created').notNull().$default(() => new Date(Date.now())),
	updated: timestamp('updated').notNull().$default(() => new Date(Date.now())),
	createdBy: varchar('created_by', { length: 255 })
		.notNull()
		.references(() => user.id),
	isActive: boolean('is_active').default(true).notNull(),
});

export const stepDefinition = pgTable('onboarding_workflow_step_definitions', {
	id: varchar('id', { length: 255 }).primaryKey(),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	name: text('name').notNull(),
	description: text('description'),
	category: stepCategoryEnum('category').notNull(),
	isSystem: boolean('is_system').default(false).notNull(),
	requiresSignature: boolean('requires_signature').default(false).notNull(),
	hasDocuments: boolean('has_documents').default(false).notNull(),
	defaultDueDay: integer('default_due_day'),
	created: timestamp('created').notNull().$default(() => new Date(Date.now())),
	updated: timestamp('updated').notNull().$default(() => new Date(Date.now())),
	createdBy: varchar('created_by', { length: 255 })
		.notNull()
		.references(() => user.id),
	isActive: boolean('is_active').default(true).notNull(),
	configuration: jsonb('configuration'),
});

export const field = pgTable('onboarding_workflow_step_fields', {
	id: varchar('id', { length: 255 }).primaryKey(),
	stepDefinitionId: varchar('step_definition_id', { length: 255 })
		.notNull()
		.references(() => stepDefinition.id),
	name: text('name').notNull(),
	label: text('label').notNull(),
	type: fieldTypeEnum('type').notNull(),
	placeholder: text('placeholder'),
	helpText: text('help_text'),
	isRequired: boolean('is_required').default(false).notNull(),
	isSystem: boolean('is_system').default(false).notNull(),
	position: integer('position').notNull(),
	options: jsonb('options'),
	validations: jsonb('validations'),
	defaultValue: text('default_value'),
	created: timestamp('created').notNull().$default(() => new Date(Date.now())),
	updated: timestamp('updated').notNull().$default(() => new Date(Date.now())),
});

export const templateStep = pgTable('template_steps', {
	id: varchar('id', { length: 255 }).primaryKey(),
	templateId: varchar('template_id')
		.notNull()
		.references(() => workflowTemplate.id),
	stepDefinitionId: varchar('step_definition_id')
		.notNull()
		.references(() => stepDefinition.id),
	position: integer('position').notNull(),
	isRequired: boolean('is_required').default(true).notNull(),
	dueDay: integer('due_day'),
	configuration: jsonb('configuration'),
	conditionalLogic: jsonb('conditional_logic'),
	created: timestamp('created').notNull().$default(() => new Date(Date.now())),
	updated: timestamp('updated').notNull().$default(() => new Date(Date.now())),
});

export const templateStepAssignee = pgTable('template_step_assignee', {
	id: varchar('id', { length: 255 }).primaryKey(),
	templateStepId: varchar('template_step_id', { length: 255 })
		.notNull()
		.references(() => templateStep.id),
	assigneeType: assigneeTypeEnum('assignee_type').notNull(),
	created: timestamp('created').notNull().$default(() => new Date(Date.now())),
	updated: timestamp('updated').notNull().$default(() => new Date(Date.now())),
}, (table) => [
	uniqueIndex('assignee_idx').on(table.templateStepId, table.assigneeType),
]);

export const onboardingWorkflow = pgTable('onboarding_workflows', {
	id: varchar('id', { length: 255 }).primaryKey(),
	employeeId: varchar('employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	templateId: varchar('template_id', { length: 255 })
		.notNull()
		.references(() => workflowTemplate.id),
	status: text('status').notNull().default('in_progress'),
	startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  dueDate: timestamp('due_date'),
	created: timestamp('created').notNull().$default(() => new Date(Date.now())),
	updated: timestamp('updated').notNull().$default(() => new Date(Date.now())),
	metadata: jsonb('metadata'),
}, (table) => [
	index('employee_workflow_idx').on(table.employeeId),
]);

export const onboardingStep = pgTable('onboarding_steps', {
	id: varchar('id', { length: 255 }).primaryKey(),
	workflowId: varchar('workflow_id', { length: 255 })
		.notNull()
		.references(() => onboardingWorkflow.id),
	templateStepId: varchar('template_step_id', { length: 255 })
		.notNull()
		.references(() => templateStep.id),
	status: stepStatusEnum('status').default('not_started').notNull(),
	position: integer('position').notNull(),
	isVisible: boolean('is_visible').default(true).notNull(),
	startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  dueDate: timestamp('due_date'),
	rejectionReason: text('rejection_reason'),
	notes: text('notes'),
	created: timestamp('created').notNull().$default(() => new Date(Date.now())),
	updated: timestamp('updated').notNull().$default(() => new Date(Date.now())),
});

export const stepResponse = pgTable('onboarding_step_responses', {
	id: varchar('id', { length: 255 }).primaryKey(),
	onboardingStepId: varchar('onboarding_step_id', { length: 255 })
		.notNull()
		.references(() => onboardingStep.id),
	fieldId: varchar('field_id', { length: 255 })
		.notNull()
		.references(() => field.id),
	value: text('value'),
	created: timestamp('created').notNull().$default(() => new Date(Date.now())),
	updated: timestamp('updated').notNull().$default(() => new Date(Date.now())),
}, (table) => [
	uniqueIndex('step_response_idx').on(table.onboardingStepId, table.fieldId),
]);

export const onboardingDocument = pgTable('onboarding_documents', {
	id: varchar('id', { length: 255 }).primaryKey(),
	clientId: varchar('client_id', { length: 255 })
		.notNull()
		.references(() => client.id),
	employeeId: varchar('employee_id', { length: 255 })
		.notNull()
		.references(() => employee.id),
	onboardingStepId: varchar('onboarding_step_id', { length: 255 })
		.notNull()
		.references(() => onboardingStep.id),
	name: text('name').notNull(),
	fileName: text('file_name').notNull(),
	mimeType: text('mime_type').notNull(),
	size: integer('size').notNull(),
	storagePath: text('storage_path').notNull(),
	category: text('category'),
	isTemplate: boolean('is_template').default(false).notNull(),
	created: timestamp('created').notNull().$default(() => new Date(Date.now())),
	updated: timestamp('updated').notNull().$default(() => new Date(Date.now())),
	uploadedBy: varchar('uploaded_by_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	metadata: jsonb('metadata'),
});

// NEED TO EDIT THESES
// Signatures
export const signatures = pgTable('signatures', {
  id: varchar('id', { length: 255 }).primaryKey(),
  onboardingStepId: varchar('onboarding_step_id').references(() => onboardingStep.id).notNull(),
  employeeId: varchar('employee_id').references(() => employee.id),
  userId: varchar('user_id').references(() => user.id),
  signatureData: text('signature_data').notNull(),
  signedAt: timestamp('signed_at').defaultNow().notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  verificationMethod: text('verification_method'),
  verified: boolean('verified').default(false).notNull(),
  documentId: varchar('document_id').references(() => onboardingDocument.id),
  created: timestamp('created').notNull().$default(() => new Date(Date.now())),
	updated: timestamp('updated').notNull().$default(() => new Date(Date.now())),
});

// Notifications
export const notifications = pgTable('notifications', {
  id: varchar('id', { length: 255 }).primaryKey(),
  type: text('type').notNull(),
  onboardingStepId: varchar('onboarding_step_id').references(() => onboardingStep.id),
  employeeId: varchar('employee_id').references(() => employee.id),
  recipientId: varchar('recipient_id').references(() => user.id),
  title: text('title').notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  sentAt: timestamp('sent_at').defaultNow().notNull(),
  readAt: timestamp('read_at'),
  metadata: jsonb('metadata'),
});

// Relations

export const workflowTemplateRelations = relations(workflowTemplate, ({ one, many }) => ({
  organization: one(client, {
    fields: [workflowTemplate.clientId],
    references: [client.id]
  }),
  creator: one(user, {
    fields: [workflowTemplate.createdBy],
    references: [user.id]
  }),
  templateSteps: many(templateStep)
}));

export const stepDefinitionRelations = relations(stepDefinition, ({ one, many }) => ({
  organization: one(client, {
    fields: [stepDefinition.clientId],
    references: [client.id]
  }),
  creator: one(user, {
    fields: [stepDefinition.createdBy],
    references: [user.id]
  }),
  fields: many(field),
  templateSteps: many(templateStep)
}));

export const templateStepRelations = relations(templateStep, ({ one, many }) => ({
  template: one(workflowTemplate, {
    fields: [templateStep.templateId],
    references: [workflowTemplate.id]
  }),
  stepDefinition: one(stepDefinition, {
    fields: [templateStep.stepDefinitionId],
    references: [stepDefinition.id]
  }),
  assignees: many(templateStepAssignee)
}));

export const onboardingWorkflowRelations = relations(onboardingWorkflow, ({ one, many }) => ({
  employee: one(employee, {
    fields: [onboardingWorkflow.employeeId],
    references: [employee.id]
  }),
  template: one(workflowTemplate, {
    fields: [onboardingWorkflow.templateId],
    references: [workflowTemplate.id]
  }),
  steps: many(onboardingStep)
}));

export const onboardingStepRelations = relations(onboardingStep, ({ one, many }) => ({
  workflow: one(onboardingWorkflow, {
    fields: [onboardingStep.workflowId],
    references: [onboardingWorkflow.id]
  }),
  templateStep: one(templateStep, {
    fields: [onboardingStep.templateStepId],
    references: [templateStep.id]
  }),
  responses: many(stepResponse),
  documents: many(onboardingDocument),
  signatures: many(signatures)
}));
