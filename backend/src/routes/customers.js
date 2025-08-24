import express from "express";
import { body, validationResult } from "express-validator";
import prisma from "../prismaClient.js";
import makeBridgeClient from "../bridgeClient.js";
import { authRequired } from "../middleware/auth.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/create-kyc-link",
  authRequired,
  body("fullName").isLength({ min: 2 }),
  body("email").isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { fullName, email, type = "individual" } = req.body;
    const bridge = makeBridgeClient(process.env.BRIDGE_API_KEY);
    try {
      const { data } = await bridge.post("/kyc_links", { full_name: fullName, email, type }, { headers: { "Idempotency-Key": uuidv4() } });
      const userId = req.user.userId;
      await prisma.customer.upsert({
        where: { bridgeId: data.customer_id ?? data.id },
        create: { bridgeId: data.customer_id ?? data.id, userId, fullName, email, status: "kyc_pending" },
        update: {}
      });
      res.json({ kyc: data });
    } catch (e) {
      console.error(e?.response?.data || e.message);
      res.status(500).json({ error: "Bridge KYC link creation failed" });
    }
  }
);

router.post("/:bridgeCustomerId/virtual-accounts",
  authRequired,
  body("currency").isString(),
  body("destination").isObject(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { bridgeCustomerId } = req.params;
    const { currency, destination } = req.body;
    const bridge = makeBridgeClient(process.env.BRIDGE_API_KEY);
    try {
      const { data } = await bridge.post(`/customers/${bridgeCustomerId}/virtual_accounts`, {
        source: { currency: currency.toLowerCase() },
        destination
      }, { headers: { "Idempotency-Key": uuidv4() } });
      // Sync minimal info locally when webhook lands; here we just return Bridge payload
      res.json({ bridge: data });
    } catch (e) {
      console.error(e?.response?.data || e.message);
      res.status(500).json({ error: "Virtual account creation failed" });
    }
  }
);

router.get("/:bridgeCustomerId/virtual-accounts/:virtualAccountId/history",
  authRequired,
  async (req, res) => {
    const { bridgeCustomerId, virtualAccountId } = req.params;
    const bridge = makeBridgeClient(process.env.BRIDGE_API_KEY);
    try {
      const { data } = await bridge.get(`/customers/${bridgeCustomerId}/virtual_accounts/${virtualAccountId}/history`);
      res.json(data);
    } catch (e) {
      console.error(e?.response?.data || e.message);
      res.status(500).json({ error: "Failed to fetch virtual account history" });
    }
  }
);

export default router;
