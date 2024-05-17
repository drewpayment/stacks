DO $$ BEGIN
 CREATE TYPE "user_role" AS ENUM('user', 'supervisor', 'admin', 'org_admin', 'super_admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "auth_user" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "client_id" varchar(255);--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "role" "user_role" DEFAULT 'user' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "auth_user" ADD CONSTRAINT "auth_user_email_unique" UNIQUE("email");