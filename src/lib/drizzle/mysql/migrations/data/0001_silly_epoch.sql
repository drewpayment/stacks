ALTER TABLE `comments` DROP FOREIGN KEY `comments_from_user_foreign`;
--> statement-breakpoint
ALTER TABLE `comments` DROP FOREIGN KEY `comments_on_post_foreign`;
--> statement-breakpoint
ALTER TABLE `employee_invoice` DROP FOREIGN KEY `employee_invoice_employee_id_foreign`;
--> statement-breakpoint
ALTER TABLE `employee_invoice` DROP FOREIGN KEY `employee_invoice_invoice_id_foreign`;
--> statement-breakpoint
ALTER TABLE `employee_permission` DROP FOREIGN KEY `employee_permission_employee_id_foreign`;
--> statement-breakpoint
ALTER TABLE `employee_permission` DROP FOREIGN KEY `employee_permission_permission_id_foreign`;
--> statement-breakpoint
ALTER TABLE `employee_user` DROP FOREIGN KEY `employee_user_employee_id_foreign`;
--> statement-breakpoint
ALTER TABLE `employee_user` DROP FOREIGN KEY `employee_user_user_id_foreign`;
--> statement-breakpoint
ALTER TABLE `manager_employees` DROP FOREIGN KEY `manager_employees_employee_id_foreign`;
--> statement-breakpoint
ALTER TABLE `manager_employees` DROP FOREIGN KEY `manager_employees_manager_id_foreign`;
--> statement-breakpoint
ALTER TABLE `posts` DROP FOREIGN KEY `posts_author_id_foreign`;
--> statement-breakpoint
ALTER TABLE `tagging_tags` DROP FOREIGN KEY `tagging_tags_tag_group_id_foreign`;
--> statement-breakpoint
ALTER TABLE `user_notifications` DROP FOREIGN KEY `user_notifications_employee_id_foreign`;
--> statement-breakpoint
ALTER TABLE `user_notifications` DROP FOREIGN KEY `user_notifications_user_id_foreign`;
--> statement-breakpoint
DROP INDEX `password_resets_email_index` ON `password_resets`;--> statement-breakpoint
DROP INDEX `password_resets_token_index` ON `password_resets`;--> statement-breakpoint
ALTER TABLE `comments` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `comments` MODIFY COLUMN `on_post` int NOT NULL;--> statement-breakpoint
ALTER TABLE `comments` MODIFY COLUMN `from_user` int NOT NULL;--> statement-breakpoint
ALTER TABLE `documents` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `employee_invoice` MODIFY COLUMN `employee_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `employee_invoice` MODIFY COLUMN `invoice_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `employee_permission` MODIFY COLUMN `employee_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `employee_permission` MODIFY COLUMN `permission_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `employee_user` MODIFY COLUMN `employee_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `employee_user` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `employees` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `employees` MODIFY COLUMN `sales_id1` varchar(15) NOT NULL;--> statement-breakpoint
ALTER TABLE `employees` MODIFY COLUMN `sales_id2` varchar(15) NOT NULL;--> statement-breakpoint
ALTER TABLE `employees` MODIFY COLUMN `sales_id3` varchar(15) NOT NULL;--> statement-breakpoint
ALTER TABLE `expenses` MODIFY COLUMN `expid` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` MODIFY COLUMN `invoice_id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `reserved_at` int;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `available_at` int NOT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `created_at` int NOT NULL;--> statement-breakpoint
ALTER TABLE `links` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `manager_employees` MODIFY COLUMN `manager_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `manager_employees` MODIFY COLUMN `employee_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `oauth_access_tokens` MODIFY COLUMN `client_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `oauth_auth_codes` MODIFY COLUMN `client_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `oauth_clients` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `oauth_personal_access_clients` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `oauth_personal_access_clients` MODIFY COLUMN `client_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `overrides` MODIFY COLUMN `ovrid` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `payroll` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `payroll` MODIFY COLUMN `agent_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `payroll_restriction` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `paystubs` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `permissions` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `personal_access_tokens` MODIFY COLUMN `tokenable_id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` MODIFY COLUMN `author_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `tagging_tag_groups` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `tagging_tagged` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `tagging_tagged` MODIFY COLUMN `taggable_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `tagging_tags` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `tagging_tags` MODIFY COLUMN `tag_group_id` int;--> statement-breakpoint
ALTER TABLE `tagging_tags` MODIFY COLUMN `count` int NOT NULL;--> statement-breakpoint
ALTER TABLE `testimonial_types` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `testimonials` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `user_notifications` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `user_notifications` MODIFY COLUMN `employee_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `uid` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `vendors` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
CREATE INDEX `email` ON `password_resets` (`email`);--> statement-breakpoint
CREATE INDEX `token` ON `password_resets` (`token`);--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_on_post_posts_id_fk` FOREIGN KEY (`on_post`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_from_user_users_uid_fk` FOREIGN KEY (`from_user`) REFERENCES `users`(`uid`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_invoice` ADD CONSTRAINT `employee_invoice_employee_id_employees_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `employee_invoice` ADD CONSTRAINT `employee_invoice_invoice_id_invoices_invoice_id_fk` FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`invoice_id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `employee_permission` ADD CONSTRAINT `employee_permission_employee_id_employees_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `employee_permission` ADD CONSTRAINT `employee_permission_permission_id_permissions_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `employee_user` ADD CONSTRAINT `employee_user_employee_id_employees_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `employee_user` ADD CONSTRAINT `employee_user_user_id_users_uid_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`uid`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `manager_employees` ADD CONSTRAINT `manager_employees_manager_id_employees_id_fk` FOREIGN KEY (`manager_id`) REFERENCES `employees`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `manager_employees` ADD CONSTRAINT `manager_employees_employee_id_employees_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_author_id_users_uid_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`uid`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tagging_tags` ADD CONSTRAINT `tagging_tags_tag_group_id_tagging_tag_groups_id_fk` FOREIGN KEY (`tag_group_id`) REFERENCES `tagging_tag_groups`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_notifications` ADD CONSTRAINT `user_notifications_user_id_users_uid_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`uid`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_notifications` ADD CONSTRAINT `user_notifications_employee_id_employees_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE no action ON UPDATE no action;