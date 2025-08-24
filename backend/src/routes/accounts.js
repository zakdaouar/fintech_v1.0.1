import express from "express";
import prisma from "../prismaClient.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

router.get("/:userId", authRequired, async (req, res) => {
  if (req.user.userId !== req.params.userId) return res.status(403).json({ error: "Forbidden" });
  const customers = await prisma.customer.findMany({
    where: { userId: req.params.userId },
    include: { vAccounts: true }
  });
  res.json(customers);
});

export default router;
