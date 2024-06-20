CREATE TABLE IF NOT EXISTS "user_client" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"client_id" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "employee" ALTER COLUMN "created" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "employee" ALTER COLUMN "updated" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "employee" ALTER COLUMN "deleted" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "employee_notes" ALTER COLUMN "created" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "payroll_cycle" ALTER COLUMN "start_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "payroll_cycle" ALTER COLUMN "end_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "payroll_cycle" ALTER COLUMN "payment_date" SET DATA TYPE timestamp;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_client" ADD CONSTRAINT "user_client_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_client" ADD CONSTRAINT "user_client_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
