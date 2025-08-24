import express from "express";
import prisma from "../prismaClient.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

router.get("/:customerId", authRequired, async (req, res) => {
  const { customerId } = req.params;
  const txs = await prisma.transfer.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" }
  });
  res.json(txs);
});

export default router;
