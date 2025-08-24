# syntax=docker/dockerfile:1
# ------------------------------------------------------------
# Backend Dockerfile (Node 20 bookworm / OpenSSL 3) — robust context handling
# - Works if build context is the repo root OR the backend/ folder
# - Ensures package.json is available at /app before npm ci
# - Removes prisma/.env so Render's DATABASE_URL is used
# ------------------------------------------------------------

FROM node:20-bookworm-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

FROM base AS deps
WORKDIR /app
# Copy entire context to /src (repo root or backend) so we can branch safely
COPY . /src
# Bring the correct package manifests into /app
RUN set -e; 
if [ -f /src/backend/package.json ]; then cp /src/backend/package*.json /app/; 
elif [ -f /src/package.json ]; then cp /src/package*.json /app/; 
else echo 'ERROR: package.json not found in /src or /src/backend' >&2; exit 1; fi
RUN npm ci || npm install

FROM deps AS build
WORKDIR /app
# Place prisma folder into /app (handles both layouts), and remove local prisma/.env
RUN set -e; 
rm -rf prisma; 
if [ -d /src/backend/prisma ]; then cp -r /src/backend/prisma /app/prisma; 
elif [ -d /src/prisma ]; then cp -r /src/prisma /app/prisma; fi; 
rm -f prisma/.env || true
# Generate Prisma client using installed deps
RUN npx prisma generate
# Copy the application source into /app (backend/ if present, else root)
RUN set -e; 
if [ -d /src/backend ]; then cp -r /src/backend/. /app/; 
else cp -r /src/. /app/; fi
# RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001
COPY --from=build /app /app
CMD ["sh","-c","rm -f prisma/.env || true; npx prisma migrate deploy && npm start"]