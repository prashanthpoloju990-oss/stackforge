import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

let databaseUrl = process.env.DATABASE_URL;

if (databaseUrl && databaseUrl.startsWith('file:')) {
  const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
  if (isVercel) {
    const srcPath = path.resolve(process.cwd(), 'db/custom.db');
    const destPath = '/tmp/custom.db';
    
    try {
      if (fs.existsSync(srcPath)) {
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        if (!fs.existsSync(destPath)) {
          fs.copyFileSync(srcPath, destPath);
          console.log(`[DB] Successfully copied SQLite database to ${destPath}`);
        }
        databaseUrl = `file:${destPath}`;
        process.env.DATABASE_URL = databaseUrl;
      } else {
        console.warn(`[DB] Source SQLite file not found at ${srcPath}`);
      }
    } catch (e) {
      console.error('[DB] Failed to copy SQLite database to /tmp:', e);
    }
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
    datasources: databaseUrl ? {
      db: {
        url: databaseUrl,
      },
    } : undefined,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db