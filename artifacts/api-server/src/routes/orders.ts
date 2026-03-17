import { Router } from "express";
import { db, ordersTable, orderItemsTable, cartItemsTable, menuItemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, requireAdmin, AuthRequest } from "../middlewares/auth.js";

const COUPONS: Record<string, number> = {
  KALAPI10: 10,
  VEGFEST20: 20,
  FIRST50: 50,
};

const router = Router();

router.post("/orders", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { deliveryName, deliveryPhone, deliveryAddress, deliveryPincode, couponCode } = req.body;

    const cartItems = await db.select().from(cartItemsTable).where(eq(cartItemsTable.userId, userId));
    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const menuItems = await Promise.all(
      cartItems.map((c) => db.select().from(menuItemsTable).where(eq(menuItemsTable.id, c.menuItemId)).limit(1))
    );

    let total = 0;
    for (let i = 0; i < cartItems.length; i++) {
      total += (menuItems[i][0]?.price || 0) * cartItems[i].quantity;
    }

    let discount = 0;
    let validCoupon = null;
    if (couponCode && COUPONS[couponCode.toUpperCase()]) {
      discount = COUPONS[couponCode.toUpperCase()];
      validCoupon = couponCode.toUpperCase();
      total = Math.max(0, total - discount);
    }

    const [order] = await db.insert(ordersTable).values({
      userId,
      total,
      deliveryName,
      deliveryPhone,
      deliveryAddress,
      deliveryPincode,
      couponCode: validCoupon,
      discount,
    }).returning();

    await Promise.all(
      cartItems.map((c, i) =>
        db.insert(orderItemsTable).values({
          orderId: order.id,
          menuItemId: c.menuItemId,
          quantity: c.quantity,
          price: menuItems[i][0]?.price || 0,
        })
      )
    );

    await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, userId));

    const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const [menuItem] = await db.select().from(menuItemsTable).where(eq(menuItemsTable.id, item.menuItemId));
        return { ...item, menuItem };
      })
    );

    return res.status(201).json({ ...order, items: enrichedItems });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/orders", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const orders = await db.select().from(ordersTable).where(eq(ordersTable.userId, userId));
    const enriched = await Promise.all(
      orders.map(async (order) => {
        const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));
        const enrichedItems = await Promise.all(
          items.map(async (item) => {
            const [menuItem] = await db.select().from(menuItemsTable).where(eq(menuItemsTable.id, item.menuItemId));
            return { ...item, menuItem };
          })
        );
        return { ...order, items: enrichedItems };
      })
    );
    return res.json(enriched.reverse());
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/orders/:id/pay", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const { razorpayPaymentId } = req.body;
    const paymentId = razorpayPaymentId || `mock_pay_${Date.now()}`;
    const [order] = await db.update(ordersTable)
      .set({ paymentStatus: "paid", paymentId, status: "preparing" })
      .where(eq(ordersTable.id, id))
      .returning();
    if (!order) return res.status(404).json({ error: "Order not found" });
    return res.json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/orders", requireAdmin as any, async (req, res) => {
  try {
    const orders = await db.select().from(ordersTable);
    const enriched = await Promise.all(
      orders.map(async (order) => {
        const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));
        const enrichedItems = await Promise.all(
          items.map(async (item) => {
            const [menuItem] = await db.select().from(menuItemsTable).where(eq(menuItemsTable.id, item.menuItemId));
            return { ...item, menuItem };
          })
        );
        return { ...order, items: enrichedItems };
      })
    );
    return res.json(enriched.reverse());
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/admin/orders/:id/status", requireAdmin as any, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const [order] = await db.update(ordersTable).set({ status }).where(eq(ordersTable.id, id)).returning();
    if (!order) return res.status(404).json({ error: "Order not found" });
    return res.json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
