import { Router } from "express";
import { db, usersTable, wishlistTable, menuItemsTable, addressesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, requireAdmin, AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/user/profile", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const [user] = await db.select({ id: usersTable.id, name: usersTable.name, email: usersTable.email, phone: usersTable.phone, role: usersTable.role, createdAt: usersTable.createdAt })
      .from(usersTable).where(eq(usersTable.id, req.userId!));
    if (!user) return res.status(404).json({ error: "Not found" });
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/user/profile", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const { name, phone } = req.body;
    const updates: any = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    const [user] = await db.update(usersTable).set(updates).where(eq(usersTable.id, req.userId!)).returning({ id: usersTable.id, name: usersTable.name, email: usersTable.email, phone: usersTable.phone, role: usersTable.role, createdAt: usersTable.createdAt });
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user/wishlist", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const items = await db.select().from(wishlistTable).where(eq(wishlistTable.userId, req.userId!));
    const menuItems = await Promise.all(
      items.map(async (w) => {
        const [item] = await db.select().from(menuItemsTable).where(eq(menuItemsTable.id, w.menuItemId));
        return item;
      })
    );
    return res.json(menuItems.filter(Boolean));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/user/wishlist", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const { menuItemId } = req.body;
    const existing = await db.select().from(wishlistTable).where(and(eq(wishlistTable.userId, req.userId!), eq(wishlistTable.menuItemId, menuItemId))).limit(1);
    if (existing.length > 0) {
      await db.delete(wishlistTable).where(eq(wishlistTable.id, existing[0].id));
      return res.json({ added: false, menuItemId });
    } else {
      await db.insert(wishlistTable).values({ userId: req.userId!, menuItemId });
      return res.json({ added: true, menuItemId });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user/addresses", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const addrs = await db.select().from(addressesTable).where(eq(addressesTable.userId, req.userId!));
    return res.json(addrs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/user/addresses", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const { label, street, city, pincode, isDefault } = req.body;
    const [addr] = await db.insert(addressesTable).values({ userId: req.userId!, label, street, city, pincode, isDefault: isDefault ?? false }).returning();
    return res.status(201).json(addr);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/user/addresses/:id", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(addressesTable).where(and(eq(addressesTable.id, id), eq(addressesTable.userId, req.userId!)));
    return res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/users", requireAdmin as any, async (req, res) => {
  try {
    const users = await db.select({ id: usersTable.id, name: usersTable.name, email: usersTable.email, role: usersTable.role, createdAt: usersTable.createdAt }).from(usersTable);
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
