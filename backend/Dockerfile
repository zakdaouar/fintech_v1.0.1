# ---------- deps ----------
FROM node:20-slim AS deps
WORKDIR /app
# Copie les manifestes pour tirer profit du cache
COPY package*.json ./
# Installe les dépendances (lockfile ou non)
RUN npm ci || npm install

# ---------- builder ----------
FROM node:20-slim AS builder
WORKDIR /app
# OpenSSL + certificats (pour Prisma & TLS)
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*
# Récupère node_modules de l'étape deps
COPY --from=deps /app/node_modules ./node_modules
# Copie tout le code backend (le contexte Render est "backend/")
COPY . .
# Génère le client Prisma (après avoir copié prisma/)
RUN npx prisma generate
# Si tu compiles du TypeScript, décommente :
# RUN npm run build

# ---------- runner ----------
FROM node:20-slim AS runner
WORKDIR /app
# Librairies nécessaires en runtime
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
# Ton serveur doit lire process.env.PORT
ENV PORT=3001
EXPOSE 3001
# Copie l’app construite
COPY --from=builder /app ./
# Migrations DB au démarrage puis lancement du serveur
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
