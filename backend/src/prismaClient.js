import { PrismaClient } from '@prisma/client';

const prisma = globalThis.__prisma ?? new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
  log: ['warn','error']
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export default prisma;