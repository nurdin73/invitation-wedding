ALTER TABLE "invitations" ADD COLUMN "content" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "sample_content" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "one_published_per_user_idx" ON "invitations" USING btree ("user_id") WHERE is_published = true;