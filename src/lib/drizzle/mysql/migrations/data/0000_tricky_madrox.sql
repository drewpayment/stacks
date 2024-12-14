-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `comments` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`on_post` int unsigned NOT NULL DEFAULT 0,
	`from_user` int unsigned NOT NULL DEFAULT 0,
	`body` text NOT NULL,
	`active` tinyint NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `company_options` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`has_paystub_notifications` tinyint NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `company_options_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	`file_path` varchar(255) NOT NULL,
	`mime_type` varchar(255) NOT NULL,
	`uploaded_by` varchar(255) NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employee_invoice` (
	`employee_id` int unsigned NOT NULL,
	`invoice_id` int unsigned NOT NULL,
	CONSTRAINT `employee_invoice_employee_id_invoice_id` PRIMARY KEY(`employee_id`,`invoice_id`)
);
--> statement-breakpoint
CREATE TABLE `employee_permission` (
	`employee_id` int unsigned NOT NULL,
	`permission_id` int unsigned NOT NULL,
	CONSTRAINT `employee_permission_employee_id_permission_id` PRIMARY KEY(`employee_id`,`permission_id`)
);
--> statement-breakpoint
CREATE TABLE `employee_user` (
	`employee_id` int unsigned NOT NULL,
	`user_id` int unsigned NOT NULL,
	CONSTRAINT `employee_user_employee_id_user_id` PRIMARY KEY(`employee_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone_no` varchar(13),
	`address` varchar(255) NOT NULL,
	`address_2` varchar(255),
	`city` varchar(255),
	`state` varchar(255),
	`postal_code` varchar(255),
	`country` varchar(255),
	`is_active` tinyint NOT NULL,
	`is_admin` tinyint NOT NULL DEFAULT 0,
	`is_mgr` tinyint NOT NULL DEFAULT 0,
	`sales_id1` varchar(15) NOT NULL DEFAULT 0,
	`sales_id2` varchar(15) NOT NULL DEFAULT 0,
	`sales_id3` varchar(15) NOT NULL DEFAULT 0,
	`created_at` timestamp,
	`updated_at` timestamp,
	`hidden_payroll` tinyint NOT NULL DEFAULT 0,
	`deleted_at` timestamp,
	`has_been_fixed` tinyint NOT NULL DEFAULT 0,
	CONSTRAINT `employees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`expid` int unsigned AUTO_INCREMENT NOT NULL,
	`vendor_id` int NOT NULL DEFAULT 1,
	`type` varchar(255) NOT NULL,
	`amount` decimal(19,4) NOT NULL DEFAULT '0.0000',
	`notes` varchar(255) NOT NULL,
	`agentid` int NOT NULL,
	`issue_date` date NOT NULL,
	`wkending` date NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `expenses_expid` PRIMARY KEY(`expid`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`invoice_id` int unsigned AUTO_INCREMENT NOT NULL,
	`vendor` varchar(200) NOT NULL,
	`sale_date` date NOT NULL,
	`first_name` varchar(60) NOT NULL,
	`last_name` varchar(60) NOT NULL,
	`address` varchar(200) NOT NULL,
	`city` varchar(200) NOT NULL,
	`status` mediumtext NOT NULL,
	`amount` varchar(255) NOT NULL DEFAULT '',
	`agentid` int NOT NULL,
	`issue_date` date NOT NULL,
	`wkending` date NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `invoices_invoice_id` PRIMARY KEY(`invoice_id`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`queue` varchar(255) NOT NULL,
	`payload` longtext NOT NULL,
	`attempts` tinyint NOT NULL,
	`reserved_at` int unsigned,
	`available_at` int unsigned NOT NULL,
	`created_at` int unsigned NOT NULL,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `links` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `links_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `manager_employees` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`manager_id` int unsigned NOT NULL,
	`employee_id` int unsigned NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `manager_employees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `migrations` (
	`migration` varchar(255) NOT NULL,
	`batch` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `oauth_access_tokens` (
	`id` varchar(100) NOT NULL,
	`user_id` bigint,
	`client_id` int unsigned NOT NULL,
	`name` varchar(255),
	`scopes` text,
	`revoked` tinyint NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	`expires_at` datetime,
	CONSTRAINT `oauth_access_tokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `oauth_auth_codes` (
	`id` varchar(100) NOT NULL,
	`user_id` bigint NOT NULL,
	`client_id` int unsigned NOT NULL,
	`scopes` text,
	`revoked` tinyint NOT NULL,
	`expires_at` datetime,
	CONSTRAINT `oauth_auth_codes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `oauth_clients` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`user_id` bigint,
	`name` varchar(255) NOT NULL,
	`secret` varchar(100),
	`redirect` text NOT NULL,
	`personal_access_client` tinyint NOT NULL,
	`password_client` tinyint NOT NULL,
	`revoked` tinyint NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `oauth_clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `oauth_personal_access_clients` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`client_id` int unsigned NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `oauth_personal_access_clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `oauth_refresh_tokens` (
	`id` varchar(100) NOT NULL,
	`access_token_id` varchar(100) NOT NULL,
	`revoked` tinyint NOT NULL,
	`expires_at` datetime,
	CONSTRAINT `oauth_refresh_tokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `overrides` (
	`ovrid` int unsigned AUTO_INCREMENT NOT NULL,
	`vendor_id` int NOT NULL DEFAULT 1,
	`name` varchar(255) NOT NULL,
	`sales` int NOT NULL,
	`commission` decimal(19,4) NOT NULL DEFAULT '0.0000',
	`total` decimal(19,4) NOT NULL DEFAULT '0.0000',
	`agentid` int NOT NULL,
	`issue_date` date NOT NULL,
	`wkending` date NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `overrides_ovrid` PRIMARY KEY(`ovrid`)
);
--> statement-breakpoint
CREATE TABLE `password_resets` (
	`email` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `payroll` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`agent_id` int unsigned NOT NULL,
	`agent_name` varchar(255) NOT NULL,
	`amount` decimal(19,4) NOT NULL DEFAULT '0.0000',
	`is_paid` tinyint NOT NULL,
	`vendor_id` int NOT NULL DEFAULT 1,
	`pay_date` date NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `payroll_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payroll_restriction` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`hour` int NOT NULL,
	`minute` int NOT NULL,
	`modified_by` int NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `payroll_restriction_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `paystubs` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`agent_id` int NOT NULL,
	`agent_name` varchar(255) NOT NULL,
	`vendor_id` int NOT NULL,
	`vendor_name` varchar(255) NOT NULL,
	`amount` decimal(19,4) NOT NULL DEFAULT '0.0000',
	`issue_date` date NOT NULL,
	`weekend_date` date NOT NULL,
	`modified_by` int NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `paystubs_id` PRIMARY KEY(`id`),
	CONSTRAINT `paystubs_agent_id_issue_date_vendor_id_unique` UNIQUE(`agent_id`,`issue_date`,`vendor_id`)
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`emp_id` int NOT NULL,
	`is_active` tinyint NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `permissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `permissions_emp_id_unique` UNIQUE(`emp_id`)
);
--> statement-breakpoint
CREATE TABLE `personal_access_tokens` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`tokenable_type` varchar(255) NOT NULL,
	`tokenable_id` serial NOT NULL,
	`name` varchar(255) NOT NULL,
	`token` varchar(64) NOT NULL,
	`abilities` text,
	`last_used_at` timestamp,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `personal_access_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `personal_access_tokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`author_id` int unsigned NOT NULL DEFAULT 0,
	`title` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`slug` varchar(255) NOT NULL,
	`active` tinyint NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `posts_title_unique` UNIQUE(`title`),
	CONSTRAINT `posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `tagging_tag_groups` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `tagging_tag_groups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tagging_tagged` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`taggable_id` int unsigned NOT NULL,
	`taggable_type` varchar(255) NOT NULL,
	`tag_name` varchar(255) NOT NULL,
	`tag_slug` varchar(255) NOT NULL,
	CONSTRAINT `tagging_tagged_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tagging_tags` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`tag_group_id` int unsigned,
	`slug` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`suggest` tinyint NOT NULL DEFAULT 0,
	`count` int unsigned NOT NULL DEFAULT 0,
	CONSTRAINT `tagging_tags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testimonial_types` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` int NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `testimonial_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`content` text NOT NULL,
	`location` varchar(255) NOT NULL,
	`testimonial_type` int NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_notifications` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int unsigned NOT NULL,
	`employee_id` int unsigned NOT NULL,
	`has_paystub_notifier` tinyint NOT NULL DEFAULT 0,
	`paystub_notifier_type` tinyint,
	`notifier_destination` varchar(255),
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `user_notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`uid` int unsigned AUTO_INCREMENT NOT NULL,
	`id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`remember_token` varchar(100),
	`created_at` timestamp,
	`updated_at` timestamp,
	`deleted_at` timestamp,
	`role` enum('admin','author','subscriber') NOT NULL DEFAULT 'author',
	CONSTRAINT `users_uid` PRIMARY KEY(`uid`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `vendors` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(300) NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	`is_active` tinyint NOT NULL,
	CONSTRAINT `vendors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `jobs_queue_index` ON `jobs` (`queue`);--> statement-breakpoint
CREATE INDEX `oauth_access_tokens_user_id_index` ON `oauth_access_tokens` (`user_id`);--> statement-breakpoint
CREATE INDEX `oauth_clients_user_id_index` ON `oauth_clients` (`user_id`);--> statement-breakpoint
CREATE INDEX `oauth_personal_access_clients_client_id_index` ON `oauth_personal_access_clients` (`client_id`);--> statement-breakpoint
CREATE INDEX `oauth_refresh_tokens_access_token_id_index` ON `oauth_refresh_tokens` (`access_token_id`);--> statement-breakpoint
CREATE INDEX `password_resets_email_index` ON `password_resets` (`email`);--> statement-breakpoint
CREATE INDEX `password_resets_token_index` ON `password_resets` (`token`);--> statement-breakpoint
CREATE INDEX `personal_access_tokens_tokenable_type_tokenable_id_index` ON `personal_access_tokens` (`tokenable_type`);--> statement-breakpoint
CREATE INDEX `tagging_tag_groups_slug_index` ON `tagging_tag_groups` (`slug`);--> statement-breakpoint
CREATE INDEX `tagging_tagged_taggable_id_index` ON `tagging_tagged` (`taggable_id`);--> statement-breakpoint
CREATE INDEX `tagging_tagged_taggable_type_index` ON `tagging_tagged` (`taggable_type`);--> statement-breakpoint
CREATE INDEX `tagging_tagged_tag_slug_index` ON `tagging_tagged` (`tag_slug`);--> statement-breakpoint
CREATE INDEX `tagging_tags_slug_index` ON `tagging_tags` (`slug`);--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_from_user_foreign` FOREIGN KEY (`from_user`) REFERENCES `users`(`uid`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_on_post_foreign` FOREIGN KEY (`on_post`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_invoice` ADD CONSTRAINT `employee_invoice_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `employee_invoice` ADD CONSTRAINT `employee_invoice_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`invoice_id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `employee_permission` ADD CONSTRAINT `employee_permission_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `employee_permission` ADD CONSTRAINT `employee_permission_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `employee_user` ADD CONSTRAINT `employee_user_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `employee_user` ADD CONSTRAINT `employee_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`uid`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `manager_employees` ADD CONSTRAINT `manager_employees_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `manager_employees` ADD CONSTRAINT `manager_employees_manager_id_foreign` FOREIGN KEY (`manager_id`) REFERENCES `employees`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users`(`uid`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tagging_tags` ADD CONSTRAINT `tagging_tags_tag_group_id_foreign` FOREIGN KEY (`tag_group_id`) REFERENCES `tagging_tag_groups`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_notifications` ADD CONSTRAINT `user_notifications_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_notifications` ADD CONSTRAINT `user_notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`uid`) ON DELETE no action ON UPDATE no action;
*/