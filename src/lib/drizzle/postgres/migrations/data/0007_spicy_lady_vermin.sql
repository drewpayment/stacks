DO $$ BEGIN
 CREATE TYPE "expense_category" AS ENUM('travel', 'meals', 'supplies', 'equipment', 'vehicles', 'utilities', 'rent', 'marketing', 'professional_development', 'subscriptions', 'insurance', 'professional_services', 'repairs', 'shipping', 'employee_benefits', 'taxes_licenses', 'interest_bank_fees', 'misc');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "expense_item" ADD COLUMN "category" "expense_category" DEFAULT 'misc' NOT NULL;