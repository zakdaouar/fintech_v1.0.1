import crypto from "crypto";
import { verifyBridgeWebhook, parseSignatureHeader } from "../src/utils/verifyBridgeWebhook.js";

test("parseSignatureHeader", () => {
  const h = "t=1700000000000,v0=YmFzZTY0";
  const parsed = parseSignatureHeader(h);
  expect(parsed.t).toBe("1700000000000");
  expect(parsed.v0).toBe("YmFzZTY0");
});

test("verifyBridgeWebhook with generated keys", () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
  const pubPem = publicKey.export({ type: "pkcs1", format: "pem" });
  const body = JSON.stringify({ hello: "world" });
  const t = String(Date.now());
  const payload = `${t}.${body}`;
  const signature = crypto.sign("sha256", Buffer.from(payload), privateKey).toString("base64");
  const header = `t=${t},v0=${signature}`;
  const ok = verifyBridgeWebhook(body, header, pubPem, 60 * 60 * 1000);
  expect(ok).toBe(true);
});
