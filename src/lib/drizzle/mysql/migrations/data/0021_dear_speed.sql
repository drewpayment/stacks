CREATE TABLE `oauth_account` (
	`provider_id` varchar(255) NOT NULL,
	`provider_user_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	CONSTRAINT `oauth_account_provider_id_provider_user_id` PRIMARY KEY(`provider_id`,`provider_user_id`)
);
--> statement-breakpoint
CREATE TABLE `password` (
	`id` varchar(255) NOT NULL,
	`hashed_password` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	CONSTRAINT `password_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `user_session` ADD `expires_at` datetime NOT NULL;--> statement-breakpoint
ALTER TABLE `oauth_account` ADD CONSTRAINT `oauth_account_user_id_auth_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `password` ADD CONSTRAINT `password_user_id_auth_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON DELETE no action ON UPDATE no action;