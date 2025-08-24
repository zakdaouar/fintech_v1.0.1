import { PrismaClient } from '@prisma/client';

// --- Sanitize Prisma engine env that can pin a mismatched engine binary/library ---
for (const k of [
  'PRISMA_QUERY_ENGINE_BINARY',
  'PRISMA_QUERY_ENGINE_LIBRARY',
  'PRISMA_CLI_QUERY_ENGINE_TYPE',
  'PRISMA_ENGINES_MIRROR',
  'PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING',
  'PRISMA_CLI_ENGINE_PROTOCOL',
]) {
  try { if (process.env[k]) { delete process.env[k]; } } catch {}
}

// --- Normalise engine selection: default to Node-API "library" ---
const allowed = new Set(['library','binary']);
if (!allowed.has(process.env.PRISMA_CLIENT_ENGINE_TYPE ?? '')) {
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