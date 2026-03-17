import { Router } from "express";
import { db, contactsTable } from "@workspace/db";

const router = Router();

router.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, message, bookingDate } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "name, email, and message are required" });
    }
    await db.insert(contactsTable).values({ name, email, phone, message, bookingDate });
    return res.status(201).json({ success: true, message: "Thank you! We'll get back to you soon." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
