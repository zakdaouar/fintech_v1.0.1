import { PrismaClient } from '@prisma/client';

// Prisma 6 only accepts PRISMA_CLIENT_ENGINE_TYPE = "library" or "binary".
// If Render has a bad value configured, normalise it BEFORE constructing the client.
const allowed = new Set(['library','binary']);
if (process.env.PRISMA_CLIENT_ENGINE_TYPE && !allowed.has(process.env.PRISMA_CLIENT_ENGINE_TYPE)) {
  console.warn(`[prisma] Invalid PRISMA_CLIENT_ENGINE_TYPE="${process.env.PRISMA_CLIENT_ENGINE_TYPE}", falling back to "library".`);
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'library';
}

const prisma = globalThis.__prisma ?? new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
  log: ['warn','error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export default prisma;