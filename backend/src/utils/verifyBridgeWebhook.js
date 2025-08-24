import crypto from "crypto";

export function parseSignatureHeader(header) {
  if (!header) return null;
  const parts = Object.fromEntries(header.split(",").map(seg => seg.split("=").map(s => s.trim())));
  if (!parts.t || !parts.v0) return null;
  return { t: parts.t, v0: parts.v0 };
}

export function verifyBridgeWebhook(rawBody, sigHeader, publicKeyPem, maxSkewMs = 10 * 60 * 1000) {
  const parsed = parseSignatureHeader(sigHeader);
  if (!parsed) return false;
  const { t, v0 } = parsed;
  const ts = Number(t);
  if (!Number.isFinite(ts)) return false;
  if (Math.abs(Date.now() - ts) > maxSkewMs) return false;
  const payload = `${t}.${rawBody}`;
  try {
    return crypto.verify("sha256", Buffer.from(payload), publicKeyPem, Buffer.from(v0, "base64"));
  } catch {
    return false;
  }
}
