ALTER TABLE `businesses` ADD `main_slug` text;--> statement-breakpoint
ALTER TABLE `businesses` ADD `source_url` text;--> statement-breakpoint
ALTER TABLE `businesses` ADD `source_verified_at` text;--> statement-breakpoint
ALTER TABLE `businesses` ADD `public_email` text;--> statement-breakpoint
CREATE INDEX `idx_businesses_main_slug` ON `businesses` (`main_slug`);