CREATE TABLE "totp_group" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"public_user_key" text,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "totp_secret" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"totp_group_id" text,
	"note" text,
	"secret" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "totp_group" ADD CONSTRAINT "totp_group_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "totp_secret" ADD CONSTRAINT "totp_secret_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "totp_secret" ADD CONSTRAINT "totp_secret_totp_group_id_totp_group_id_fk" FOREIGN KEY ("totp_group_id") REFERENCES "public"."totp_group"("id") ON DELETE no action ON UPDATE no action;