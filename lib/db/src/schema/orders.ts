import { pgTable, text, serial, timestamp, integer, real, pgEnum } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { menuItemsTable } from "./menu";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const orderStatusEnum = pgEnum("order_status", ["pending", "preparing", "out_for_delivery", "delivered", "cancelled"]);
export const paymentStatusEnum = pgEnum("payment_status", ["unpaid", "paid", "failed"]);

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id).notNull(),
  total: real("total").notNull(),
  status: orderStatusEnum("status").default("pending").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").default("unpaid").notNull(),
  paymentId: text("payment_id"),
  deliveryName: text("delivery_name").notNull(),
  deliveryPhone: text("delivery_phone").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  deliveryPincode: text("delivery_pincode"),
  couponCode: text("coupon_code"),
  discount: real("discount").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItemsTable = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => ordersTable.id).notNull(),
  menuItemId: integer("menu_item_id").references(() => menuItemsTable.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
export type OrderItem = typeof orderItemsTable.$inferSelect;
