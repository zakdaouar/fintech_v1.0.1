FROM node:20-bookworm-slim

# Dépendances système minimales (openssl pour Prisma sur Debian 12, curl pour healthcheck)
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Dépendances Node (avec fallback si pas de lockfile)
COPY package*.json ./
RUN /bin/sh -lc 'if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi'

# Prisma client
COPY prisma ./prisma
# Ne jamais embarquer un .env Prisma dans l'image, on utilisera l'env Render
RUN rm -f prisma/.env || true
RUN npx prisma generate

# Code source (ESM)
COPY src ./src

# Port par défaut; Render injecte $PORT
EXPOSE 3000

# Healthcheck simple via curl sur /health
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS http://127.0.0.1:${PORT:-3000}/health || exit 1

# Au démarrage: appliquer migrations (si présentes), puis lancer le serveur
CMD ["sh","-lc","npx prisma migrate deploy || true; node src/server.js"]