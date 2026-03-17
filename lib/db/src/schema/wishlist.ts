import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { menuItemsTable } from "./menu";

export const wishlistTable = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id).notNull(),
  menuItemId: integer("menu_item_id").references(() => menuItemsTable.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type WishlistItem = typeof wishlistTable.$inferSelect;
