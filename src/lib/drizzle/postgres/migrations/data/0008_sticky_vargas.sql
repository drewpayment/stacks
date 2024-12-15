ALTER TABLE "expense_report" ALTER COLUMN "paystub_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "imported_id" varchar(255) DEFAULT '';