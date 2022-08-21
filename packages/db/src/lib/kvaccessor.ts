import type { MpaDatabase } from '../db';

export function createKeyValueAccessor<T extends object>(key: string, db: MpaDatabase) {
  return {
    get: async () => (await db.prisma.keyValue.findUnique({ where: { key } }))?.value as T,
    upsert: async (value: T) =>
      (
        await db.prisma.keyValue.upsert({
          where: { key },
          create: { key, value },
          update: { value }
        })
      ).value as T
  };
}
