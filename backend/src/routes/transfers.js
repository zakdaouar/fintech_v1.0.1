import express from "express";
import { body, validationResult } from "express-validator";
import prisma from "../prismaClient.js";
import makeBridgeClient from "../bridgeClient.js";
import { authRequired } from "../middleware/auth.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/",
  authRequired,
  body("bridgeCustomerId").isString(),
  body("amount").isFloat({ gt: 0 }),
  body("source").isObject(),
  body("destination").isObject(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { bridgeCustomerId, amount, currency = "usd", source, destination } = req.body;
    const bridge = makeBridgeClient(process.env.BRIDGE_API_KEY);
    try {
      const { data: transfer } = await bridge.post("/transfers", {
        on_behalf_of: bridgeCustomerId,
        amount: String(amount),
        source: { ...source, currency: source.currency || currency },
        destination: { ...destination },
      }, { headers: { "Idempotency-Key": uuidv4() } });

      const customer = await prisma.customer.findFirst({ where: { bridgeId: bridgeCustomerId } });
      if (customer) {
        await prisma.transfer.create({
          data: {
            bridgeId: transfer.id,
            customerId: customer.id,
            amount: parseFloat(transfer.amount ?? amount),
            currency: destination.currency || currency,
            status: transfer.state || "created"
          }
        });
      }
      res.json({ transfer });
    } catch (e) {
      console.error(e?.response?.data || e.message);
      res.status(500).json({ error: "Transfer creation failed" });
    }
  }
);

export default router;
