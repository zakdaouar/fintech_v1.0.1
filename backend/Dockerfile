# syntax=docker/dockerfile:1
# ------------------------------------------------------------
# Dockerfile robuste pour Render (Node 20 / OpenSSL 3)
# - Contexte root OU backend : on copie tout vers /src puis on choisit
# - Conserve node_modules (build FROM deps)
# - Supprime prisma/.env (Render DATABASE_URL gagne)
# - Force Prisma binaire, healthcheck, traces
# ------------------------------------------------------------

FROM node:20-bookworm-slim AS base
WORKDIR /app
RUN ["/bin/sh","-lc","apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*"]

# ---- deps ----
FROM base AS deps
WORKDIR /app
COPY . /src
RUN ["/bin/sh","-lc","set -e; if [ -f /src/backend/package.json ]; then cp /src/backend/package*.json /app/; elif [ -f /src/package.json ]; then cp /src/package*.json /app/; else echo 'ERROR: package.json not found in /src or /src/backend' >&2; exit 1; fi"]
RUN ["/bin/sh","-lc","if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then npm ci; else npm install; fi"]

# ---- build ----
FROM deps AS build
WORKDIR /app
RUN ["/bin/sh","-lc","set -e; rm -rf prisma; if [ -d /src/backend/prisma ]; then cp -r /src/backend/prisma /app/prisma; elif [ -d /src/prisma ]; then cp -r /src/prisma /app/prisma; fi; rm -f prisma/.env || true"]
RUN ["/bin/sh","-lc","npx prisma generate"]
RUN ["/bin/sh","-lc","set -e; if [ -d /src/backend ]; then cp -r /src/backend/. /app/; else cp -r /src/. /app/; fi"]

# ---- run ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NODE_OPTIONS="--trace-uncaught --trace-warnings --enable-source-maps"
ENV RUST_BACKTRACE=1
ENV PRISMA_CLIENT_ENGINE_TYPE=binary
EXPOSE 3001
COPY --from=build /app /app
HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=12 CMD ["/bin/sh","-lc","node -e \"fetch('http://127.0.0.1:'+(process.env.PORT||3001)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))\" "]
CMD ["/bin/sh","-lc","rm -f prisma/.env || true; npx prisma migrate deploy && npm start"]