# syntax=docker/dockerfile:1
# ------------------------------------------------------------------
# Simple, deterministic Dockerfile for Render (Node 20 / OpenSSL 3)
# - Context = repo root, app directory = backend/
# - Keeps node_modules (build FROM deps)
# - Removes prisma/.env so Render's DATABASE_URL wins
# - Forces Prisma binary engine at runtime
# - Adds HEALTHCHECK
# ------------------------------------------------------------------

FROM node:20-bookworm-slim AS base
WORKDIR /app
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# ---- deps ----
FROM base AS deps
WORKDIR /app
# Copy manifests from backend subdir
COPY backend/package*.json ./
# Install (ci if lock exists, else install)
RUN if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then npm ci; else npm install; fi

# ---- build ----
FROM deps AS build
WORKDIR /app
# Prisma schema (from backend)
COPY backend/prisma ./prisma
# Ensure no local prisma/.env overrides Render env
RUN rm -f prisma/.env || true
# Generate Prisma client (engines for OpenSSL 3 are pulled in @ generate)
RUN npx prisma generate
# Copy application sources
COPY backend/ ./
# If you have a build step, uncomment:
# RUN npm run build

# ---- run ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NODE_OPTIONS=--trace-uncaught --trace-warnings --enable-source-maps
ENV RUST_BACKTRACE=1
# Force Prisma binary engine to avoid Node-API mismatches
ENV PRISMA_CLIENT_ENGINE_TYPE=binary
# Render injecte PORT ; on expose 3001 à titre indicatif
EXPOSE 3001

COPY --from=build /app /app

HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=12 \
  CMD ["/bin/sh","-lc","node -e \"fetch('http://127.0.0.1:'+(process.env.PORT||3001)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))\" "]

# Migrations puis démarrage
CMD ["sh","-c","rm -f prisma/.env || true; npx prisma migrate deploy && npm start"]