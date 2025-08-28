CREATE TABLE "students" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"surname" varchar(255) NOT NULL,
	"birthday_at" timestamp NOT NULL,
	"student_id" bigint,
	"gender" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_ids" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "synopsis" text;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "categories" text;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_student_id_student_ids_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_ids"("id") ON DELETE set null ON UPDATE no action;