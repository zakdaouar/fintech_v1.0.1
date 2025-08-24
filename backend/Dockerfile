# syntax=docker/dockerfile:1
# ------------------------------------------------------------
# Backend Dockerfile (Node 20 bookworm / OpenSSL 3) — JSON-form RUN
# - deps: npm ci
# - build: FROM deps (keeps node_modules)
# - copies context to /src (works for repo root or backend/ build contexts)
# - removes prisma/.env so Render's DATABASE_URL is used
# ------------------------------------------------------------

FROM node:20-bookworm-slim AS base
WORKDIR /app
RUN ["/bin/sh","-lc","apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*"]

FROM base AS deps
WORKDIR /app
COPY . /src
RUN ["/bin/sh","-lc","set -e; if [ -f /src/backend/package.json ]; then cp /src/backend/package*.json /app/; elif [ -f /src/package.json ]; then cp /src/package*.json /app/; else echo 'ERROR: package.json not found in /src or /src/backend' >&2; exit 1; fi"]
RUN ["/bin/sh","-lc","npm ci || npm install"]

FROM deps AS build
WORKDIR /app
RUN ["/bin/sh","-lc","set -e; rm -rf prisma; if [ -d /src/backend/prisma ]; then cp -r /src/backend/prisma /app/prisma; elif [ -d /src/prisma ]; then cp -r /src/prisma /app/prisma; fi; rm -f prisma/.env || true"]
RUN ["/bin/sh","-lc","npx prisma generate"]
RUN ["/bin/sh","-lc","set -e; if [ -d /src/backend ]; then cp -r /src/backend/. /app/; else cp -r /src/. /app/; fi"]
# RUN ["/bin/sh","-lc","npm run build"]

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PRISMA_CLIENT_ENGINE_TYPE=binary
ENV PORT=3001
EXPOSE 3001
COPY --from=build /app /app
CMD ["/bin/sh","-lc","rm -f prisma/.env || true; npx prisma migrate deploy && npm start"]
ENV PRISMA_LOG_LEVEL=info
