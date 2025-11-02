import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();

// Extend Request type to hold decoded user info
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// 🔐 Authentication middleware
const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized: No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey123");
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// 👑 Admin-only middleware
const adminOnly = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Access denied. Admins only." });
  next();
};

// ✅ Get all sweets (user + admin)
router.get("/", authenticate, async (_req, res) => {
  try {
    const sweets = await prisma.sweet.findMany();
    res.json(sweets);
  } catch (error) {
    console.error("❌ Error fetching sweets:", error);
    res.status(500).json({ message: "Error fetching sweets." });
  }
});

// ✅ Add sweet (admin)
router.post("/", authenticate, adminOnly, async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;
    if (!name || !category || price === undefined)
      return res.status(400).json({ message: "All fields required." });

    const sweet = await prisma.sweet.create({
      data: {
        name: String(name),
        category: String(category),
        price: parseFloat(price),
        quantity: quantity ? parseInt(quantity) : 0,
      },
    });

    res.status(201).json({ message: "Sweet added successfully!", sweet });
  } catch (error) {
    console.error("❌ Error adding sweet:", error);
    res.status(500).json({ message: "Error adding sweet." });
  }
});

// ✅ Update sweet (admin)
router.put("/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid sweet ID." });

    const { name, category, price, quantity } = req.body;
    const updateData: any = {};

    if (name !== undefined) updateData.name = String(name);
    if (category !== undefined) updateData.category = String(category);
    if (price !== undefined) updateData.price = parseFloat(price);
    if (quantity !== undefined) updateData.quantity = parseInt(quantity);

    const updated = await prisma.sweet.update({
      where: { id },
      data: updateData,
    });

    console.log("✅ Sweet updated:", updated);
    res.json({ message: "Sweet updated successfully!", sweet: updated });
  } catch (error) {
    console.error("❌ Error updating sweet:", error);
    res.status(500).json({ message: "Error updating sweet." });
  }
});

// ✅ Restock sweet (admin)
router.post("/:id/restock", authenticate, adminOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { amount } = req.body;

    const restockAmount = parseInt(amount);
    if (isNaN(id) || isNaN(restockAmount) || restockAmount <= 0)
      return res.status(400).json({ message: "Invalid restock amount or ID." });

    const updated = await prisma.sweet.update({
      where: { id },
      data: { quantity: { increment: restockAmount } },
    });

    console.log(`✅ Sweet ID ${id} restocked by ${restockAmount}`);
    res.json({ message: "Sweet restocked successfully!", sweet: updated });
  } catch (error) {
    console.error("❌ Error restocking sweet:", error);
    res.status(500).json({ message: "Error restocking sweet." });
  }
});

// ✅ Delete sweet (admin)
router.delete("/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid sweet ID." });

    await prisma.sweet.delete({ where: { id } });
    res.json({ message: "Sweet deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting sweet:", error);
    res.status(500).json({ message: "Error deleting sweet." });
  }
});

// ✅ Purchase sweet (user)
router.post("/:id/purchase", authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid sweet ID." });

    const sweet = await prisma.sweet.findUnique({ where: { id } });
    if (!sweet) return res.status(404).json({ message: "Sweet not found." });
    if (sweet.quantity <= 0) return res.status(400).json({ message: "Out of stock!" });

    const updated = await prisma.sweet.update({
      where: { id },
      data: { quantity: { decrement: 1 } },
    });

    res.json({ message: "Sweet purchased successfully!", sweet: updated });
  } catch (error) {
    console.error("❌ Error purchasing sweet:", error);
    res.status(500).json({ message: "Error purchasing sweet." });
  }
});

export default router;
