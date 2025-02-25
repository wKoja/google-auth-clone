ALTER TABLE "totp_secret" ADD COLUMN "public_user_key" text;--> statement-breakpoint
ALTER TABLE "totp_group" DROP COLUMN "public_user_key";