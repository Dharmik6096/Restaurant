import { Router } from "express";
import { db, cartItemsTable, menuItemsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/cart", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const items = await db.select().from(cartItemsTable).where(eq(cartItemsTable.userId, userId));
    const enriched = await Promise.all(
      items.map(async (item) => {
        const [menuItem] = await db.select().from(menuItemsTable).where(eq(menuItemsTable.id, item.menuItemId));
        return { ...item, menuItem };
      })
    );
    return res.json(enriched);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/cart", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ error: "Bad request", message: "Request body is required" });
    }
    const { menuItemId, quantity } = req.body;
    const existing = await db.select().from(cartItemsTable).where(and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.menuItemId, menuItemId))).limit(1);
    let item;
    if (existing.length > 0) {
      [item] = await db.update(cartItemsTable).set({ quantity: existing[0].quantity + quantity }).where(eq(cartItemsTable.id, existing[0].id)).returning();
    } else {
      [item] = await db.insert(cartItemsTable).values({ userId, menuItemId, quantity }).returning();
    }
    const [menuItem] = await db.select().from(menuItemsTable).where(eq(menuItemsTable.id, item.menuItemId));
    return res.json({ ...item, menuItem });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/cart/:menuItemId", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const menuItemId = parseInt(req.params.menuItemId);
    const { quantity } = req.body;
    if (quantity <= 0) {
      await db.delete(cartItemsTable).where(and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.menuItemId, menuItemId)));
      return res.json({ success: true, message: "Removed" });
    }
    const [item] = await db.update(cartItemsTable).set({ quantity }).where(and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.menuItemId, menuItemId))).returning();
    const [menuItem] = await db.select().from(menuItemsTable).where(eq(menuItemsTable.id, menuItemId));
    return res.json({ ...item, menuItem });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/cart/:menuItemId", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const menuItemId = parseInt(req.params.menuItemId);
    await db.delete(cartItemsTable).where(and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.menuItemId, menuItemId)));
    return res.json({ success: true, message: "Removed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/cart", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, userId));
    return res.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
