// schema.ts (Drizzle ORM - PostgreSQL)
import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  unique,
  index,
} from "drizzle-orm/pg-core";

// If you want Swap.state as free-form text (like Prisma String), keep it as text.
// If you prefer an enum, uncomment below and use it in swaps.state.
// export const swapStateEnum = pgEnum("swap_state", ["pending", "accepted", "rejected"]);

// ----------------------
// Tables
// ----------------------

export const flats = pgTable(
  "Flat",
  {
    id: serial("id").primaryKey(),
    ownerId: text("ownerId").notNull().unique(), // Prisma: ownerId String @unique
    description: text("description"),
    squareMeters: integer("squareMeters"),
    rooms: integer("rooms"),

    // Prisma String[] -> Postgres text[]
    images: text("images").array().notNull().default([]),

    createdAt: timestamp("createdAt", { withTimezone: false })
      .notNull()
      .defaultNow(),

    dateFrom: timestamp("dateFrom", { withTimezone: false }).notNull(),
    dateTo: timestamp("dateTo", { withTimezone: false }).notNull(),

    swapWithCity: text("swapWithCity").notNull(),

    imagesPaths: text("imagesPaths").array().notNull().default([]),
  },
  (t) => ({
    ownerIdIdx: index("ownerId").on(t.ownerId), // Prisma @@index([ownerId], map: "ownerId")
  }),
);

export const addresses = pgTable(
  "Address",
  {
    id: serial("id").primaryKey(),
    street: text("street").notNull(),
    city: text("city").notNull(),
    country: text("country").notNull(),

    // One-to-one: flatId is unique + FK with cascade
    flatId: integer("flatId")
      .notNull()
      .unique()
      .references(() => flats.id, { onDelete: "cascade" }),
  },
  (t) => ({
    flatIdIdx: index("flatId").on(t.flatId), // Prisma @@index([flatId], map: "flatId")
  }),
);

export const swaps = pgTable(
  "Swap",
  {
    id: serial("id").primaryKey(),
    state: text("state").notNull(),
    // state: swapStateEnum("state").notNull(), // if you switch to enum above

    swapperId: integer("swapperId")
      .notNull()
      .references(() => flats.id, { onDelete: "cascade" }),

    swappeeId: integer("swappeeId")
      .notNull()
      .references(() => flats.id, { onDelete: "cascade" }),

    createdAt: timestamp("createdAt", { withTimezone: false })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    swapperSwappeeUnique: unique("Swap_swapperId_swappeeId_key").on(
      t.swapperId,
      t.swappeeId,
    ), // Prisma @@unique([swapperId, swappeeId])
  }),
);

// ----------------------
// Relations
// ----------------------

export const flatRelations = relations(flats, ({ one, many }) => ({
  address: one(addresses, {
    fields: [flats.id],
    references: [addresses.flatId],
  }),

  // Equivalent of:
  // Swap_Swap_swappeeIdToFlat Swap[] @relation("Swap_swappeeIdToFlat")
  swapsAsSwappee: many(swaps, { relationName: "Swap_swappeeIdToFlat" }),

  // Swap_Swap_swapperIdToFlat Swap[] @relation("Swap_swapperIdToFlat")
  swapsAsSwapper: many(swaps, { relationName: "Swap_swapperIdToFlat" }),
}));

export const addressRelations = relations(addresses, ({ one }) => ({
  flat: one(flats, {
    fields: [addresses.flatId],
    references: [flats.id],
  }),
}));

export const swapRelations = relations(swaps, ({ one }) => ({
  swappeeFlat: one(flats, {
    relationName: "Swap_swappeeIdToFlat",
    fields: [swaps.swappeeId],
    references: [flats.id],
  }),
  swapperFlat: one(flats, {
    relationName: "Swap_swapperIdToFlat",
    fields: [swaps.swapperId],
    references: [flats.id],
  }),
}));
