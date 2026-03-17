import { Router } from "express";
import { db, menuItemsTable } from "@workspace/db";
import { eq, ilike, and } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";

const router = Router();

router.get("/menu", async (req, res) => {
  try {
    const { category, search } = req.query as { category?: string; search?: string };
    let items = await db.select().from(menuItemsTable).where(eq(menuItemsTable.isAvailable, true));
    if (category) {
      items = items.filter((i) => i.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) => i.name.toLowerCase().includes(q) || (i.description && i.description.toLowerCase().includes(q))
      );
    }
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/menu", requireAdmin as any, async (req, res) => {
  try {
    const { name, description, price, category, image, isVeg, isAvailable, isFeatured } = req.body;
    const [item] = await db.insert(menuItemsTable).values({ name, description, price, category, image, isVeg: isVeg ?? true, isAvailable: isAvailable ?? true, isFeatured: isFeatured ?? false }).returning();
    return res.status(201).json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/menu/:id", requireAdmin as any, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, price, category, image, isVeg, isAvailable, isFeatured } = req.body;
    const [item] = await db.update(menuItemsTable).set({ name, description, price, category, image, isVeg, isAvailable, isFeatured }).where(eq(menuItemsTable.id, id)).returning();
    if (!item) return res.status(404).json({ error: "Not found" });
    return res.json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/menu/:id", requireAdmin as any, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(menuItemsTable).where(eq(menuItemsTable.id, id));
    return res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
