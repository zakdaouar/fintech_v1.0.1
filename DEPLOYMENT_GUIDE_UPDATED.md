# Fintech V1 — Deployment Guide (Render + Vercel)

## 1) Create GitHub repo
- Unzip this archive locally.
- `git init && git add . && git commit -m "init"`
- Create an empty repo on GitHub and `git remote add origin <ssh-or-https>` then `git push -u origin main`.

## 2) Backend on Render
- Create a **Web Service** from `backend/`.
- Runtime: (your stack), Region: closest to Vercel region.
- Add env vars (examples):
  - `BRIDGE_API_KEY=...`
  - `WEBHOOK_SECRET=...`
  - `CORS_ALLOW_ORIGIN=https://<your-vercel-domain>`
- Configure a **PostgreSQL** database on Render and expose its URL as `DATABASE_URL`.
- Add HTTP routes for Bridge webhooks, e.g.:
  - `POST /api/webhooks/bridge/account`
  - `POST /api/webhooks/bridge/transaction`
- Health endpoint expected: `GET /api/health` returns 200.

## 3) Frontend on Vercel
- Import the GitHub repo.
- Set **Root Directory** = `frontend`.
- Build command: default (`next build`), Output Dir: default (`.next`).
- Environment variables:
  - `NEXT_PUBLIC_API_BASE_URL=https://<render-backend-host>`
- **Do not** enable "Use Path Aliases" feature; we already configure tsconfig.
- Ensure `package.json` has `next`, `react`, `react-dom` and UI deps (added here).

## 4) Common pitfalls (we handled them)
- UTF-8 **without BOM** in `package.json` (we write it correctly).
- `@/*` path alias configured (`tsconfig.json`).
- Tailwind + PostCSS are CJS config files to avoid ESM build surprises.
- Pages router `_app.tsx` ensures `globals.css` is loaded.
- If Lovable included React Router, prefer Next pages. This build is CSR-safe by default.

## 5) Smoke test
- Open Vercel URL: should render "Frontend is installed (Lovable UI)".
- Replace the index view with your Lovable landing component in `src/pages/index.tsx` or connect routes found under `src/pages`.
- Call `GET /api/health` from the frontend using `NEXT_PUBLIC_API_BASE_URL` to verify connectivity.

