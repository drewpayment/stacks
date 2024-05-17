DO $$ BEGIN
 CREATE TYPE "approval_status" AS ENUM('pending', 'approved', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "status_description" AS ENUM('pending', 'approved', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "campaigns" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"client_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"url" varchar(255) DEFAULT '',
	"description" text DEFAULT '',
	"active" boolean DEFAULT false NOT NULL,
	"created" bigint NOT NULL,
	"updated" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"contact_user_id" varchar(255),
	"created" bigint NOT NULL,
	"updated" bigint NOT NULL,
	"deleted" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_verification" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employee" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" varchar(255),
	"client_id" varchar(255) NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"is_commissionable" boolean DEFAULT false NOT NULL,
	"created" bigint NOT NULL,
	"updated" bigint NOT NULL,
	"deleted" bigint,
	CONSTRAINT "employee_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employee_codes" (
	"employee_id" text NOT NULL,
	"campaign_id" text NOT NULL,
	"employee_code" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	CONSTRAINT employee_codes_employee_id_employee_code PRIMARY KEY("employee_id","employee_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employee_notes" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"employee_id" varchar(255) NOT NULL,
	"note" text NOT NULL,
	"created" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employee_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"employee_id" varchar(255) NOT NULL,
	"address" text NOT NULL,
	"address_2" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"zip" text NOT NULL,
	"phone" text NOT NULL,
	"phone_2" text,
	"email" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "expense_item" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"client_id" varchar(255) NOT NULL,
	"expense_report_id" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"amount" numeric DEFAULT '0.00' NOT NULL,
	"date_incurred" bigint NOT NULL,
	"receipt_url" varchar(1024)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "expense_report" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"employee_id" varchar(255) NOT NULL,
	"client_id" varchar(255) NOT NULL,
	"paystub_id" varchar(255) NOT NULL,
	"submission_date" bigint NOT NULL,
	"approval_status" "approval_status" DEFAULT 'pending' NOT NULL,
	"approval_date" bigint,
	"approval_notes" text,
	"total_amount" numeric DEFAULT '0.00' NOT NULL,
	"created" bigint NOT NULL,
	"updated" bigint NOT NULL,
	"deleted" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oauth_account" (
	"provider_id" text NOT NULL,
	"provider_user_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT oauth_account_provider_id_provider_user_id PRIMARY KEY("provider_id","provider_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "overriding_employee" (
	"id" text PRIMARY KEY NOT NULL,
	"employee_id" varchar(255) NOT NULL,
	"overriding_employee_id" varchar(255) NOT NULL,
	"override_amount" numeric(10, 2) DEFAULT '0.00' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "password" (
	"id" text PRIMARY KEY NOT NULL,
	"hashed_password" text NOT NULL,
	"user_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "password_reset_token" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payroll_cycle" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"client_id" varchar(255) NOT NULL,
	"start_date" bigint NOT NULL,
	"end_date" bigint NOT NULL,
	"payment_date" bigint NOT NULL,
	"created" bigint NOT NULL,
	"updated" bigint NOT NULL,
	"deleted" bigint,
	"is_closed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "paystub" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"employee_id" varchar(255) NOT NULL,
	"client_id" varchar(255) NOT NULL,
	"payroll_cycle_id" varchar(255) DEFAULT '',
	"campaign_id" varchar(255) NOT NULL,
	"total_sales" bigint NOT NULL,
	"total_overrides" bigint NOT NULL,
	"piece_rate" numeric NOT NULL,
	"gross_pay" numeric NOT NULL,
	"net_pay" numeric NOT NULL,
	"tax_deductions" numeric DEFAULT '0.00' NOT NULL,
	"other_deductions" numeric DEFAULT '0.00' NOT NULL,
	"created" bigint NOT NULL,
	"updated" bigint NOT NULL,
	"deleted" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sale" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"employee_id" varchar(255) NOT NULL,
	"client_id" varchar(255) NOT NULL,
	"paystub_id" varchar(255) DEFAULT '',
	"campaign_id" varchar(255) NOT NULL,
	"sale_date" bigint NOT NULL,
	"customer_first_name" varchar(255) NOT NULL,
	"customer_last_name" varchar(255) NOT NULL,
	"customer_address" varchar(255) NOT NULL,
	"sale_amount" numeric DEFAULT '0.00' NOT NULL,
	"is_complete" boolean DEFAULT false NOT NULL,
	"status_description" "status_description" DEFAULT 'rejected' NOT NULL,
	"created" bigint NOT NULL,
	"updated" bigint NOT NULL,
	"deleted" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sale_override" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"client_id" varchar(255) NOT NULL,
	"sale_id" varchar(255),
	"originating_employee_id" varchar(255) NOT NULL,
	"beneficiary_employee_id" varchar(255) NOT NULL,
	"override_amount" numeric DEFAULT '0.00' NOT NULL,
	"paid_on_paystub_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_key" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"hashed_password" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_profile" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"picture" varchar(1024),
	CONSTRAINT "user_profile_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_session" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client" ADD CONSTRAINT "client_contact_user_id_auth_user_id_fk" FOREIGN KEY ("contact_user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_verification" ADD CONSTRAINT "email_verification_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employee" ADD CONSTRAINT "employee_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employee" ADD CONSTRAINT "employee_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employee_codes" ADD CONSTRAINT "employee_codes_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employee_codes" ADD CONSTRAINT "employee_codes_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employee_notes" ADD CONSTRAINT "employee_notes_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employee_profile" ADD CONSTRAINT "employee_profile_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expense_item" ADD CONSTRAINT "expense_item_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expense_item" ADD CONSTRAINT "expense_item_expense_report_id_expense_report_id_fk" FOREIGN KEY ("expense_report_id") REFERENCES "expense_report"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expense_report" ADD CONSTRAINT "expense_report_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expense_report" ADD CONSTRAINT "expense_report_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expense_report" ADD CONSTRAINT "expense_report_paystub_id_paystub_id_fk" FOREIGN KEY ("paystub_id") REFERENCES "paystub"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_account" ADD CONSTRAINT "oauth_account_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "overriding_employee" ADD CONSTRAINT "overriding_employee_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "overriding_employee" ADD CONSTRAINT "overriding_employee_overriding_employee_id_employee_id_fk" FOREIGN KEY ("overriding_employee_id") REFERENCES "employee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "password" ADD CONSTRAINT "password_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "password_reset_token" ADD CONSTRAINT "password_reset_token_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payroll_cycle" ADD CONSTRAINT "payroll_cycle_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "paystub" ADD CONSTRAINT "paystub_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "paystub" ADD CONSTRAINT "paystub_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "paystub" ADD CONSTRAINT "paystub_payroll_cycle_id_payroll_cycle_id_fk" FOREIGN KEY ("payroll_cycle_id") REFERENCES "payroll_cycle"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "paystub" ADD CONSTRAINT "paystub_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sale" ADD CONSTRAINT "sale_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sale" ADD CONSTRAINT "sale_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sale" ADD CONSTRAINT "sale_paystub_id_paystub_id_fk" FOREIGN KEY ("paystub_id") REFERENCES "paystub"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sale" ADD CONSTRAINT "sale_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sale_override" ADD CONSTRAINT "sale_override_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sale_override" ADD CONSTRAINT "sale_override_sale_id_sale_id_fk" FOREIGN KEY ("sale_id") REFERENCES "sale"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sale_override" ADD CONSTRAINT "sale_override_originating_employee_id_employee_id_fk" FOREIGN KEY ("originating_employee_id") REFERENCES "employee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sale_override" ADD CONSTRAINT "sale_override_beneficiary_employee_id_employee_id_fk" FOREIGN KEY ("beneficiary_employee_id") REFERENCES "employee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sale_override" ADD CONSTRAINT "sale_override_paid_on_paystub_id_paystub_id_fk" FOREIGN KEY ("paid_on_paystub_id") REFERENCES "paystub"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_key" ADD CONSTRAINT "user_key_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_session" ADD CONSTRAINT "user_session_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
