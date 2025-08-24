# Deploy backend on Render

## Option A — Docker runtime (no Build/Start fields)
- Keep `backend/Dockerfile` in repo.
- Render → New → Web Service → Build from GitHub → Root Directory: `backend`.
- Set env vars: `DATABASE_URL`, `JWT_SECRET`, `BRIDGE_API_KEY`, (later) `BRIDGE_WEBHOOK_PUBLIC_KEY`.
- Deploy (use "Clear build cache & deploy" when Dockerfile changes).

## Option B — Node runtime (shows Build/Start fields)
- Rename `backend/Dockerfile` → `Dockerfile.bak` and push.
- Build: `npm ci && npx prisma generate`
- Start: `npx prisma migrate deploy && node src/server.js`

## Webhook setup
```bash
cd backend
npm install
BRIDGE_API_KEY=sk_your_key \
npm run setup:webhook -- --url https://<your>.onrender.com/api/webhooks/bridge --events transfer,virtual_account,customer --enable
```
Paste PEM into `BRIDGE_WEBHOOK_PUBLIC_KEY` and redeploy.
