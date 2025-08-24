# syntax=docker/dockerfile:1
# Root-context Dockerfile (Node 20 / OpenSSL 3)  app in backend/
FROM node:20-bookworm-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

FROM base AS deps
WORKDIR /app
COPY backend/package*.json ./
RUN if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then npm ci; else npm install; fi

FROM deps AS build
WORKDIR /app
COPY backend/prisma ./prisma
RUN rm -f prisma/.env || true
RUN npx prisma generate
COPY backend/ ./
# RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NODE_OPTIONS="--trace-uncaught --trace-warnings --enable-source-maps"
ENV RUST_BACKTRACE=1
ENV PRISMA_CLIENT_ENGINE_TYPE=binary
EXPOSE 3001
COPY --from=build /app /app
HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=12 \
  CMD ["/bin/sh","-lc","node -e \"fetch('http://127.0.0.1:'+(process.env.PORT||3001)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))\" "]
CMD ["sh","-c","rm -f prisma/.env || true; npx prisma migrate deploy && npm start"]