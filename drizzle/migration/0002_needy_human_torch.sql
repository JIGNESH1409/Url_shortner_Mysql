ALTER TABLE `short_link` ADD `userID` int NOT NULL;--> statement-breakpoint
ALTER TABLE `short_link` ADD `created_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `short_link` ADD `updated_at` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `short_link` ADD CONSTRAINT `short_link_userID_users_id_fk` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;