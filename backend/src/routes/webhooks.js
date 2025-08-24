import express from "express";
import prisma from "../prismaClient.js";
import { verifyBridgeWebhook } from "../utils/verifyBridgeWebhook.js";

const router = express.Router();

// Keep raw body ONLY on this route to verify signature on exact bytes
router.use(express.raw({ type: "*/*" }));

router.post("/", async (req, res) => {
  const sigHeader = req.get("X-Webhook-Signature") || req.get("x-webhook-signature");
  const raw = req.body.toString("utf8");
  const ok = verifyBridgeWebhook(raw, sigHeader, process.env.BRIDGE_WEBHOOK_PUBLIC_KEY);
  if (!ok) return res.status(401).send("Invalid signature");

  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    return res.status(400).send("Invalid JSON");
  }

  try {
    const category = (event?.event_category || "").toLowerCase();
    const obj = event?.event_object || {};

    // 1) Transfers — update status
    if (category === "transfer") {
      await prisma.transfer.update({
        where: { bridgeId: obj.id },
        data: { status: obj.state || event.event_object_status || "updated" }
      }).catch(() => {}); // ignore if not found locally
    }

    // 2) Virtual accounts — upsert/update details
    if (category === "virtual_account") {
      const bridgeCustomerId = obj.customer_id || obj.customer || obj.on_behalf_of || event?.on_behalf_of || null;
      const currency = (obj?.source?.currency || obj?.currency || "").toLowerCase() || "usd";
      const instr = obj?.source_deposit_instructions || {};

      // Try to find the local customer (may be absent if created outside our app)
      let customer = null;
      if (bridgeCustomerId) {
        customer = await prisma.customer.findFirst({ where: { bridgeId: bridgeCustomerId } });
      }

      // Update if exists; if not and we have a customer, create
      const data = {
        currency,
        status: obj.status || event.event_object_status || "updated",
        bankAccountNumber: instr.bank_account_number ?? undefined,
        bankRoutingNumber: instr.bank_routing_number ?? undefined,
        bankName: instr.bank_name ?? undefined,
      };

      const existing = await prisma.virtualAccount.findUnique({ where: { bridgeId: obj.id } });
      if (existing) {
        await prisma.virtualAccount.update({ where: { bridgeId: obj.id }, data });
      } else if (customer) {
        await prisma.virtualAccount.create({
          data: {
            bridgeId: obj.id,
            customerId: customer.id,
            ...data
          }
        });
      } // else: can't create without mapping to a local customer; ignore safely
    }

    // 3) Customer (KYC/KYB) — sync status and known fields
    if (category === "customer") {
      const bridgeCustomerId = obj.id;
      const status = obj.status || event.event_object_status || "updated";
      const fullName = obj.full_name || obj.name || undefined;
      const email = obj.email || undefined;

      const existing = await prisma.customer.findFirst({ where: { bridgeId: bridgeCustomerId } });
      if (existing) {
        await prisma.customer.update({
          where: { id: existing.id },
          data: {
            status,
            ...(fullName ? { fullName } : {}),
            ...(email ? { email } : {})
          }
        });
      }
      // If the customer was created entirely outside our app, we don't know which userId to attach.
      // In that case, we skip creation to avoid orphan records.
    }

    return res.sendStatus(200);
  } catch (e) {
    console.error("Webhook handler error:", e?.response?.data || e.message);
    return res.status(500).send("Handler error");
  }
});

export default router;
