import { PrismaClient } from '@prisma/client'
import path from 'path'

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Keep logging quiet in dev to reduce memory pressure (OOM kills observed).
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db