# ------------------------------------------------------------
# Backend Dockerfile (OpenSSL 3 / Node 20 bookworm)
# - Installs openssl + ca-certificates
# - Generates Prisma client with debian-openssl-3.0.x
# - Runs migrations on container start, then npm start
# ------------------------------------------------------------

# ---------- base ----------
FROM node:20-bookworm-slim AS base
WORKDIR /app

# OpenSSL & certs for Prisma & TLS
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# ---------- deps ----------
FROM base AS deps
WORKDIR /app
COPY package*.json ./
# Keep dev deps so 
px prisma exists at runtime for migrate deploy
RUN npm ci || npm install

# ---------- build ----------
FROM deps AS build
WORKDIR /app
# generate Prisma first so the correct engine is bundled
COPY prisma ./prisma
RUN npx prisma generate
# copy the rest of the app
COPY . .
# If your backend needs a build step, uncomment:
# RUN npm run build

# ---------- runner ----------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

# Bring over built app + node_modules + generated Prisma client
COPY --from=build /app ./

# Run migrations on start, then your app's start script
# Ensure your package.json has:  "start": "node src/server.js"  (or similar)
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
