FROM node:20-bookworm-slim

# Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances Node.js
RUN npm ci --only=production

# Copier le schéma Prisma et générer le client
COPY prisma/ ./prisma/
RUN npx prisma generate

# Copier le code source
COPY src/ ./src/

# Port exposé
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-3000}/health || exit 1

# Commande de démarrage
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
