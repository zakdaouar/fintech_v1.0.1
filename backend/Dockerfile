# syntax=docker/dockerfile:1
# ------------------------------------------------------------
# Backend Dockerfile (OpenSSL 3 / Node 20 bookworm) — safe format
# No line-continuations; keeps Prisma generate in build stage.
# ------------------------------------------------------------

FROM node:20-bookworm-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install

FROM base AS build
WORKDIR /app
COPY prisma ./prisma
RUN rm -f prisma/.env || true
RUN npx prisma generate
COPY . .
# RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001
COPY --from=build /app ./
CMD ["sh","-c","rm -f prisma/.env || true; npx prisma migrate deploy && npm start"]