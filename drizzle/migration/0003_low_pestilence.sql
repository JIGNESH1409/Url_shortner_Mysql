ALTER TABLE `short_link` DROP INDEX `short_link_short_code_unique`;--> statement-breakpoint
ALTER TABLE `short_link` ADD CONSTRAINT `unique_short_url_per_user` UNIQUE(`short_code`,`userID`);