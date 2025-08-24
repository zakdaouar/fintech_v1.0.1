# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS base
ENV NODE_ENV=production
WORKDIR /app

# SSL + curl for migrations and basic diagnostics
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl ca-certificates curl \
 && rm -rf /var/lib/apt/lists/*

# --- deps ---
FROM base AS deps
WORKDIR /app
COPY package*.json ./
# If a lockfile exists, use ci; otherwise fall back to npm install.
RUN if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then \
      npm ci --omit=dev; \
    else \
      npm install --omit=dev; \
    fi

# --- build (generate Prisma client) ---
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
# Ensure we don't bake a stale DB URL into the image
RUN rm -f prisma/.env || true
# Generate Prisma client without requiring devDeps
RUN npx --yes prisma generate
# Bring the rest of the backend into the image context
COPY . .

# --- runner ---
FROM base AS runner
WORKDIR /app
ENV PORT=3001
COPY --from=build /app /app

# Start: apply migrations, then run the server
CMD npx prisma migrate deploy && node src/server.js