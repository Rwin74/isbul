CREATE TABLE `applications` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`applicant` text NOT NULL,
	`name` text NOT NULL,
	`contact` text NOT NULL,
	`message` text NOT NULL,
	`created` integer NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_applications_post_applicant` ON `applications` (`post_id`,`applicant`);--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`district` text NOT NULL,
	`sector` text NOT NULL,
	`date` text NOT NULL,
	`hours` text NOT NULL,
	`pay` integer NOT NULL,
	`description` text NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_posts_created` ON `posts` (`created`);