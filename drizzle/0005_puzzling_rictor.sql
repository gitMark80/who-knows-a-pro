CREATE TABLE `admin_login_tokens` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`expires_at` integer NOT NULL,
	`used_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_admin_login_tokens_email` ON `admin_login_tokens` (`email`,`created_at`);--> statement-breakpoint
CREATE TABLE `admin_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_admin_sessions_email` ON `admin_sessions` (`email`);--> statement-breakpoint
CREATE TABLE `featured_slots` (
	`id` text PRIMARY KEY NOT NULL,
	`region` text NOT NULL,
	`trade` text NOT NULL,
	`business_id` text NOT NULL,
	`business_slug` text NOT NULL,
	`stripe_checkout_session_id` text,
	`stripe_subscription_id` text,
	`status` text NOT NULL,
	`reserved_until` integer,
	`activated_at` integer,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_featured_slots_page` ON `featured_slots` (`region`,`trade`);--> statement-breakpoint
CREATE INDEX `idx_featured_slots_business` ON `featured_slots` (`business_slug`);--> statement-breakpoint
CREATE INDEX `idx_featured_slots_subscription` ON `featured_slots` (`stripe_subscription_id`);--> statement-breakpoint
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`zip` text NOT NULL,
	`job_description` text NOT NULL,
	`preferred_contact_method` text NOT NULL,
	`region` text NOT NULL,
	`trade` text NOT NULL,
	`page_url` text NOT NULL,
	`ip_address` text NOT NULL,
	`routed` integer DEFAULT 0 NOT NULL,
	`routed_business_id` text,
	`routed_business_slug` text,
	`routed_at` integer,
	`owner_notification_status` text DEFAULT 'pending' NOT NULL,
	`business_notification_status` text DEFAULT 'not_applicable' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_leads_region_trade_created` ON `leads` (`region`,`trade`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_leads_ip_created` ON `leads` (`ip_address`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_leads_routed_business` ON `leads` (`routed_business_slug`,`created_at`);--> statement-breakpoint
CREATE TABLE `profile_views` (
	`id` text PRIMARY KEY NOT NULL,
	`business_slug` text NOT NULL,
	`viewer_hash` text NOT NULL,
	`viewed_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_profile_views_business_date` ON `profile_views` (`business_slug`,`viewed_at`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`business_id` text NOT NULL,
	`business_slug` text NOT NULL,
	`stripe_customer_id` text NOT NULL,
	`plan` text NOT NULL,
	`status` text NOT NULL,
	`featured_region` text,
	`featured_trade` text,
	`cancel_at_period_end` integer DEFAULT 0 NOT NULL,
	`current_period_end` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_subscriptions_business` ON `subscriptions` (`business_slug`);--> statement-breakpoint
CREATE INDEX `idx_subscriptions_customer` ON `subscriptions` (`stripe_customer_id`);--> statement-breakpoint
CREATE INDEX `idx_subscriptions_status` ON `subscriptions` (`status`);--> statement-breakpoint
ALTER TABLE `claims` ADD `requested_plan` text;--> statement-breakpoint
ALTER TABLE `claims` ADD `requested_region` text;--> statement-breakpoint
ALTER TABLE `claims` ADD `requested_trade` text;