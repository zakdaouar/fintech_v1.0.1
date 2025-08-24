/**
 * Create/enable Bridge webhook, print public key (PEM).
 * Usage:
 * BRIDGE_API_KEY=sk_xxx node scripts/create-bridge-webhook.mjs --url https://your-domain.com/api/webhooks/bridge --events transfer,virtual_account,customer --enable
 */
const API = "https://api.bridge.xyz/v0";

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true;
      args[key] = val;
    }
  }
  return args;
}

const args = parseArgs(process.argv);
const apiKey = process.env.BRIDGE_API_KEY;
const url = args.url || args.u;
const eventsArg = (args.events || args.e || "transfer,virtual_account,customer").toString();
const enable = !!args.enable;

if (!apiKey) {
  console.error("Missing BRIDGE_API_KEY env.");
  process.exit(1);
}
if (!url) {
  console.error("Usage: BRIDGE_API_KEY=... node scripts/create-bridge-webhook.mjs --url https://<domain>/api/webhooks/bridge [--events transfer,virtual_account,customer] [--enable]");
  process.exit(1);
}

const event_categories = eventsArg.split(",").map(s => s.trim()).filter(Boolean);

async function main() {
  const res = await fetch(`${API}/webhooks`, {
    method: "POST",
    headers: { "Api-Key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ url, event_categories })
  });
  if (!res.ok) throw new Error(`Create webhook failed ${res.status}: ${await res.text()}`);
  const created = await res.json();

  let final = created;
  if (enable) {
    const put = await fetch(`${API}/webhooks/${created.id}`, {
      method: "PUT",
      headers: { "Api-Key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ status: "active" })
    });
    if (!put.ok) throw new Error(`Enable webhook failed ${put.status}: ${await put.text()}`);
    final = await put.json();
  }

  const out = {
    id: final.id || created.id,
    status: final.status || created.status,
    url: final.url || url,
    event_categories: final.event_categories || event_categories,
    public_key: final.public_key || created.public_key || "<not returned>"
  };
  console.log(JSON.stringify(out, null, 2));

  if (out.public_key?.startsWith("-----BEGIN")) {
    console.error("\nCopy this into your backend env as BRIDGE_WEBHOOK_PUBLIC_KEY:");
    console.error(out.public_key);
  } else {
    console.error("\nIf public_key missing, list endpoints:");
    console.error("curl -H 'Api-Key: $BRIDGE_API_KEY' https://api.bridge.xyz/v0/webhooks");
  }
}

main().catch(e => { console.error(e.stack || e.message); process.exit(1); });
