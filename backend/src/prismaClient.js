import { PrismaClient } from '@prisma/client';

// Choix moteur côté client:
// - 'binary' = exécutable (fiable sur Render/OpenSSL 3)
// - 'library' = Node-API (si tu veux retester plus tard, mets PRISMA_CLIENT_ENGINE_TYPE=library)
const engineType = (process.env.PRISMA_CLIENT_ENGINE_TYPE === 'library') ? 'library' : 'binary';

const prisma = globalThis.__prisma ?? new PrismaClient({
  engineType,
  datasources: {
    db: { url: process.env.DATABASE_URL }
  },
  log: ['warn', 'error']
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export default prisma;