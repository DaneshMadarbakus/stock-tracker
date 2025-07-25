import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, unique, index } from "drizzle-orm/pg-core";
import { usersSync } from "drizzle-orm/neon";

// ────────────────────────────────────────────────
// USER PROFILES — app-level user info
export const userProfiles = pgTable("user_profiles", {
  userId: text("user_id")
    .primaryKey()
    .references(() => usersSync.id, { onDelete: "cascade" }),
  name: text("name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ────────────────────────────────────────────────
// WATCHLIST — user-tracked stocks
export const watchlist = pgTable(
  "watchlist",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: text("user_id")
      .notNull()
      .references(() => usersSync.id, { onDelete: "cascade" }),
    symbol: text("symbol").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    unique("unique_user_symbol").on(t.userId, t.symbol),
    index("watchlist_user_id_idx").on(t.userId),

    // RLS-ready: add crudPolicy here if/when enabling RLS later
  ]
);

// ────────────────────────────────────────────────
// Types
export type InsertWatchlist = typeof watchlist.$inferInsert;
export type SelectWatchlist = typeof watchlist.$inferSelect;
