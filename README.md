# Fintech Full (Backend + Lovable Frontend + Presenter)

Single repository you can unzip and push to GitHub. Frontend uses the Lovable UI only.
Backend stays isolated. Presenter is a thin API client used by the UI (MVP Passive View).

## Structure
- `backend/` — your API + Bridge.xyz webhook endpoints
- `frontend/` — Next.js 14 + Tailwind + Lovable components
- `presenter/` — light API client orchestrating calls (UI stays passive)

## Dev Quickstart
1. `cd frontend && npm i && npm run dev` (UI)
2. `cd backend` (start your server with your stack / instructions)
3. Point the presenter/API base URL via env var on the frontend (e.g. `NEXT_PUBLIC_API_BASE_URL`).

See `DEPLOYMENT_GUIDE_UPDATED.md` for full step-by-step instructions (Render + Vercel).
