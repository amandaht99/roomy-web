CREATE TABLE "Address" (
	"id" serial PRIMARY KEY NOT NULL,
	"street" text NOT NULL,
	"city" text NOT NULL,
	"country" text NOT NULL,
	"flatId" integer NOT NULL,
	CONSTRAINT "Address_flatId_unique" UNIQUE("flatId")
);
--> statement-breakpoint
CREATE TABLE "Flat" (
	"id" serial PRIMARY KEY NOT NULL,
	"ownerId" text NOT NULL,
	"description" text,
	"squareMeters" integer,
	"rooms" integer,
	"images" text[] DEFAULT '{}' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"dateFrom" timestamp NOT NULL,
	"dateTo" timestamp NOT NULL,
	"swapWithCity" text NOT NULL,
	"imagesPaths" text[] DEFAULT '{}' NOT NULL,
	CONSTRAINT "Flat_ownerId_unique" UNIQUE("ownerId")
);
--> statement-breakpoint
CREATE TABLE "Swap" (
	"id" serial PRIMARY KEY NOT NULL,
	"state" text NOT NULL,
	"swapperId" integer NOT NULL,
	"swappeeId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Swap_swapperId_swappeeId_key" UNIQUE("swapperId","swappeeId")
);
--> statement-breakpoint
ALTER TABLE "Address" ADD CONSTRAINT "Address_flatId_Flat_id_fk" FOREIGN KEY ("flatId") REFERENCES "public"."Flat"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Swap" ADD CONSTRAINT "Swap_swapperId_Flat_id_fk" FOREIGN KEY ("swapperId") REFERENCES "public"."Flat"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Swap" ADD CONSTRAINT "Swap_swappeeId_Flat_id_fk" FOREIGN KEY ("swappeeId") REFERENCES "public"."Flat"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "flatId" ON "Address" USING btree ("flatId");--> statement-breakpoint
CREATE INDEX "ownerId" ON "Flat" USING btree ("ownerId");