import { mysqlTable, primaryKey, text, tinyint, timestamp, serial, varchar, int, decimal, date, mediumtext, index, longtext, bigint, datetime, unique, mysqlEnum } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const legacyComments = mysqlTable("comments", {
	id: int("id").autoincrement().notNull(),
	onPost: int("on_post").default(0).notNull().references(() => legacyPosts.id, { onDelete: "cascade" } ),
	fromUser: int("from_user").default(0).notNull().references(() => legacyUsers.uid, { onDelete: "cascade" } ),
	body: text("body").notNull(),
	active: tinyint("active").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		commentsId: primaryKey(table.id),
	}
});

export const legacyCompanyOptions = mysqlTable("company_options", {
	id: serial("id").notNull(),
	hasPaystubNotifications: tinyint("has_paystub_notifications").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		companyOptionsId: primaryKey(table.id),
	}
});

export const legacyDocuments = mysqlTable("documents", {
	id: int("id").autoincrement().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	description: varchar("description", { length: 255 }).notNull(),
	filePath: varchar("file_path", { length: 255 }).notNull(),
	mimeType: varchar("mime_type", { length: 255 }).notNull(),
	uploadedBy: varchar("uploaded_by", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		documentsId: primaryKey(table.id),
	}
});

export const legacyEmployeeInvoice = mysqlTable("employee_invoice", {
	employeeId: int("employee_id").notNull().references(() => legacyEmployees.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	invoiceId: int("invoice_id").notNull().references(() => legacyInvoices.invoiceId, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		employeeInvoiceEmployeeIdInvoiceId: primaryKey(table.employeeId, table.invoiceId),
	}
});

export const legacyEmployeePermission = mysqlTable("employee_permission", {
	employeeId: int("employee_id").notNull().references(() => legacyEmployees.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	permissionId: int("permission_id").notNull().references(() => legacyPermissions.id, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		employeePermissionEmployeeIdPermissionId: primaryKey(table.employeeId, table.permissionId),
	}
});

export const legacyEmployeeUser = mysqlTable("employee_user", {
	employeeId: int("employee_id").notNull().references(() => legacyEmployees.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	userId: int("user_id").notNull().references(() => legacyUsers.uid, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		employeeUserEmployeeIdUserId: primaryKey(table.employeeId, table.userId),
	}
});

export const legacyEmployees = mysqlTable("employees", {
	id: int("id").autoincrement().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	phoneNo: varchar("phone_no", { length: 13 }),
	address: varchar("address", { length: 255 }).notNull(),
	address2: varchar("address_2", { length: 255 }),
	city: varchar("city", { length: 255 }),
	state: varchar("state", { length: 255 }),
	postalCode: varchar("postal_code", { length: 255 }),
	country: varchar("country", { length: 255 }),
	isActive: tinyint("is_active").notNull(),
	isAdmin: tinyint("is_admin").default(0).notNull(),
	isMgr: tinyint("is_mgr").default(0).notNull(),
	salesId1: varchar("sales_id1", { length: 15 }).notNull(),
	salesId2: varchar("sales_id2", { length: 15 }).notNull(),
	salesId3: varchar("sales_id3", { length: 15 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	hiddenPayroll: tinyint("hidden_payroll").default(0).notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	hasBeenFixed: tinyint("has_been_fixed").default(0).notNull(),
},
(table) => {
	return {
		employeesId: primaryKey(table.id),
	}
});

export const legacyExpenses = mysqlTable("expenses", {
	expid: int("expid").autoincrement().notNull(),
	vendorId: int("vendor_id").default(1).notNull(),
	type: varchar("type", { length: 255 }).notNull(),
	amount: decimal("amount", { precision: 19, scale: 4 }).default('0.0000').notNull(),
	notes: varchar("notes", { length: 255 }).notNull(),
	agentid: int("agentid").notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	issueDate: date("issue_date", { mode: 'string' }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	wkending: date("wkending", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		expensesExpid: primaryKey(table.expid),
	}
});

export const legacyInvoices = mysqlTable("invoices", {
	invoiceId: int("invoice_id").autoincrement().notNull(),
	vendor: varchar("vendor", { length: 200 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	saleDate: date("sale_date", { mode: 'string' }).notNull(),
	firstName: varchar("first_name", { length: 60 }).notNull(),
	lastName: varchar("last_name", { length: 60 }).notNull(),
	address: varchar("address", { length: 200 }).notNull(),
	city: varchar("city", { length: 200 }).notNull(),
	status: mediumtext("status").notNull(),
	amount: varchar("amount", { length: 255 }).default('').notNull(),
	agentid: int("agentid").notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	issueDate: date("issue_date", { mode: 'string' }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	wkending: date("wkending", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		invoicesInvoiceId: primaryKey(table.invoiceId),
	}
});

export const legacyJobs = mysqlTable("jobs", {
	id: serial("id").notNull(),
	queue: varchar("queue", { length: 255 }).notNull(),
	payload: longtext("payload").notNull(),
	attempts: tinyint("attempts").notNull(),
	reservedAt: int("reserved_at"),
	availableAt: int("available_at").notNull(),
	createdAt: int("created_at").notNull(),
},
(table) => {
	return {
		queueIdx: index('jobs_queue_index').on(table.queue),
		jobsId: primaryKey(table.id),
	}
});

export const legacyLinks = mysqlTable("links", {
	id: int("id").autoincrement().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		linksId: primaryKey(table.id),
	}
});

export const legacyManagerEmployees = mysqlTable("manager_employees", {
	id: serial("id").notNull(),
	managerId: int("manager_id").notNull().references(() => legacyEmployees.id),
	employeeId: int("employee_id").notNull().references(() => legacyEmployees.id),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		managerEmployeesId: primaryKey(table.id),
	}
});

export const migrations = mysqlTable("migrations", {
	migration: varchar("migration", { length: 255 }).notNull(),
	batch: int("batch").notNull(),
});

export const legacyOauthAccessTokens = mysqlTable("oauth_access_tokens", {
	id: varchar("id", { length: 100 }).notNull(),
	userId: bigint("user_id", { mode: "number" }),
	clientId: int("client_id").notNull(),
	name: varchar("name", { length: 255 }),
	scopes: text("scopes"),
	revoked: tinyint("revoked").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	expiresAt: datetime("expires_at", { mode: 'string'}),
},
(table) => {
	return {
		userIdIdx: index('oauth_access_tokens_user_id_index').on(table.userId),
		oauthAccessTokensId: primaryKey(table.id),
	}
});

export const legacyOauthAuthCodes = mysqlTable("oauth_auth_codes", {
	id: varchar("id", { length: 100 }).notNull(),
	userId: bigint("user_id", { mode: "number" }).notNull(),
	clientId: int("client_id").notNull(),
	scopes: text("scopes"),
	revoked: tinyint("revoked").notNull(),
	expiresAt: datetime("expires_at", { mode: 'string'}),
},
(table) => {
	return {
		oauthAuthCodesId: primaryKey(table.id),
	}
});

export const legacyOauthClients = mysqlTable("oauth_clients", {
	id: int("id").autoincrement().notNull(),
	userId: bigint("user_id", { mode: "number" }),
	name: varchar("name", { length: 255 }).notNull(),
	secret: varchar("secret", { length: 100 }),
	redirect: text("redirect").notNull(),
	personalAccessClient: tinyint("personal_access_client").notNull(),
	passwordClient: tinyint("password_client").notNull(),
	revoked: tinyint("revoked").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		userIdIdx: index('oauth_clients_user_id_index').on(table.userId),
		oauthClientsId: primaryKey(table.id),
	}
});

export const legacyOauthPersonalAccessClients = mysqlTable("oauth_personal_access_clients", {
	id: int("id").autoincrement().notNull(),
	clientId: int("client_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		clientIdIdx: index('oauth_personal_access_clients_client_id_index').on(table.clientId),
		oauthPersonalAccessClientsId: primaryKey(table.id),
	}
});

export const legacyOauthRefreshTokens = mysqlTable("oauth_refresh_tokens", {
	id: varchar("id", { length: 100 }).notNull(),
	accessTokenId: varchar("access_token_id", { length: 100 }).notNull(),
	revoked: tinyint("revoked").notNull(),
	expiresAt: datetime("expires_at", { mode: 'string'}),
},
(table) => {
	return {
		accessTokenIdIdx: index('oauth_refresh_tokens_access_token_id_index').on(table.accessTokenId),
		oauthRefreshTokensId: primaryKey(table.id),
	}
});

export const legacyOverrides = mysqlTable("overrides", {
	ovrid: int("ovrid").autoincrement().notNull(),
	vendorId: int("vendor_id").default(1).notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	sales: int("sales").notNull(),
	commission: decimal("commission", { precision: 19, scale: 4 }).default('0.0000').notNull(),
	total: decimal("total", { precision: 19, scale: 4 }).default('0.0000').notNull(),
	agentid: int("agentid").notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	issueDate: date("issue_date", { mode: 'string' }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	wkending: date("wkending", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		overridesOvrid: primaryKey(table.ovrid),
	}
});

export const legacyPasswordResets = mysqlTable("password_resets", {
	email: varchar("email", { length: 255 }).notNull(),
	token: varchar("token", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
},
(table) => {
	return {
		emailIdx: index('email').on(table.email),
		tokenIdx: index('token').on(table.token),
	}
});

export const legacyPayroll = mysqlTable("payroll", {
	id: int("id").autoincrement().notNull(),
	agentId: int("agent_id").notNull(),
	agentName: varchar("agent_name", { length: 255 }).notNull(),
	amount: decimal("amount", { precision: 19, scale: 4 }).default('0.0000').notNull(),
	isPaid: tinyint("is_paid").notNull(),
	vendorId: int("vendor_id").default(1).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	payDate: date("pay_date", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		payrollId: primaryKey(table.id),
	}
});

export const legacyPayrollRestriction = mysqlTable("payroll_restriction", {
	id: int("id").autoincrement().notNull(),
	hour: int("hour").notNull(),
	minute: int("minute").notNull(),
	modifiedBy: int("modified_by").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		payrollRestrictionId: primaryKey(table.id),
	}
});

export const legacyPaystubs = mysqlTable("paystubs", {
	id: int("id").autoincrement().notNull(),
	agentId: int("agent_id").notNull(),
	agentName: varchar("agent_name", { length: 255 }).notNull(),
	vendorId: int("vendor_id").notNull(),
	vendorName: varchar("vendor_name", { length: 255 }).notNull(),
	amount: decimal("amount", { precision: 19, scale: 4 }).default('0.0000').notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	issueDate: date("issue_date", { mode: 'string' }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	weekendDate: date("weekend_date", { mode: 'string' }).notNull(),
	modifiedBy: int("modified_by").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		paystubsId: primaryKey(table.id),
		paystubsAgentIdIssueDateVendorIdUnique: unique("paystubs_agent_id_issue_date_vendor_id_unique").on(table.agentId, table.issueDate, table.vendorId),
	}
});

export const legacyPermissions = mysqlTable("permissions", {
	id: int("id").autoincrement().notNull(),
	empId: int("emp_id").notNull(),
	isActive: tinyint("is_active").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		permissionsId: primaryKey(table.id),
		permissionsEmpIdUnique: unique("permissions_emp_id_unique").on(table.empId),
	}
});

export const legacyPersonalAccessTokens = mysqlTable("personal_access_tokens", {
	id: serial("id").notNull(),
	tokenableType: varchar("tokenable_type", { length: 255 }).notNull(),
	tokenableId: serial("tokenable_id").notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	token: varchar("token", { length: 64 }).notNull(),
	abilities: text("abilities"),
	lastUsedAt: timestamp("last_used_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		tokenableTypeTokenableIdIdx: index("personal_access_tokens_tokenable_type_tokenable_id_index").on(table.tokenableType),
		personalAccessTokensId: primaryKey(table.id),
		personalAccessTokensTokenUnique: unique("personal_access_tokens_token_unique").on(table.token),
	}
});

export const legacyPosts = mysqlTable("posts", {
	id: int("id").autoincrement().notNull(),
	authorId: int("author_id").default(0).notNull().references(() => legacyUsers.uid, { onDelete: "cascade" } ),
	title: varchar("title", { length: 255 }).notNull(),
	body: text("body").notNull(),
	slug: varchar("slug", { length: 255 }).notNull(),
	active: tinyint("active").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		postsId: primaryKey(table.id),
		postsTitleUnique: unique("posts_title_unique").on(table.title),
		postsSlugUnique: unique("posts_slug_unique").on(table.slug),
	}
});

export const legacyTaggingTagGroups = mysqlTable("tagging_tag_groups", {
	id: int("id").autoincrement().notNull(),
	slug: varchar("slug", { length: 255 }).notNull(),
	name: varchar("name", { length: 255 }).notNull(),
},
(table) => {
	return {
		slugIdx: index('tagging_tag_groups_slug_index').on(table.slug),
		taggingTagGroupsId: primaryKey(table.id),
	}
});

export const legacyTaggingTagged = mysqlTable("tagging_tagged", {
	id: int("id").autoincrement().notNull(),
	taggableId: int("taggable_id").notNull(),
	taggableType: varchar("taggable_type", { length: 255 }).notNull(),
	tagName: varchar("tag_name", { length: 255 }).notNull(),
	tagSlug: varchar("tag_slug", { length: 255 }).notNull(),
},
(table) => {
	return {
		taggableIdIdx: index('tagging_tagged_taggable_id_index').on(table.taggableId),
		taggableTypeIdx: index('tagging_tagged_taggable_type_index').on(table.taggableType),
		tagSlugIdx: index('tagging_tagged_tag_slug_index').on(table.tagSlug),
		taggingTaggedId: primaryKey(table.id),
	}
});

export const legacyTaggingTags = mysqlTable("tagging_tags", {
	id: int("id").autoincrement().notNull(),
	tagGroupId: int("tag_group_id").references(() => legacyTaggingTagGroups.id),
	slug: varchar("slug", { length: 255 }).notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	suggest: tinyint("suggest").default(0).notNull(),
	count: int("count").default(0).notNull(),
},
(table) => {
	return {
		slugIdx: index('tagging_tags_slug_index').on(table.slug),
		taggingTagsId: primaryKey(table.id),
	}
});

export const legacyTestimonialTypes = mysqlTable("testimonial_types", {
	id: int("id").autoincrement().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	type: int("type").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		testimonialTypesId: primaryKey(table.id),
	}
});

export const legacyTestimonials = mysqlTable("testimonials", {
	id: int("id").autoincrement().notNull(),
	content: text("content").notNull(),
	location: varchar("location", { length: 255 }).notNull(),
	testimonialType: int("testimonial_type").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		testimonialsId: primaryKey(table.id),
	}
});

export const legacyUserNotifications = mysqlTable("user_notifications", {
	id: serial("id").notNull(),
	userId: int("user_id").notNull().references(() => legacyUsers.uid),
	employeeId: int("employee_id").notNull().references(() => legacyEmployees.id),
	hasPaystubNotifier: tinyint("has_paystub_notifier").default(0).notNull(),
	paystubNotifierType: tinyint("paystub_notifier_type"),
	notifierDestination: varchar("notifier_destination", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		userNotificationsId: primaryKey(table.id),
	}
});

export const legacyUsers = mysqlTable("users", {
	uid: int("uid").autoincrement().notNull(),
	id: int("id").notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	password: varchar("password", { length: 255 }).notNull(),
	rememberToken: varchar("remember_token", { length: 100 }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	role: mysqlEnum("role", ['admin','author','subscriber']).default('author').notNull(),
},
(table) => {
	return {
		usersUid: primaryKey(table.uid),
		usersEmailUnique: unique("users_email_unique").on(table.email),
	}
});

export const legacyVendors = mysqlTable("vendors", {
	id: int("id").autoincrement().notNull(),
	name: varchar("name", { length: 300 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	isActive: tinyint("is_active").notNull(),
},
(table) => {
	return {
		vendorsId: primaryKey(table.id),
	}
});