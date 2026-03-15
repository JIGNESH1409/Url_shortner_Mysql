CREATE TABLE `session` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userID` int NOT NULL,
	`valid` boolean NOT NULL DEFAULT true,
	`user_Agent` text,
	`ip` varchar(255),
	`Created_At` timestamp NOT NULL DEFAULT (now()),
	`updated_At` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_userID_users_id_fk` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;