import type { BaseDatabase } from '../base';

export function createKeyValueAccessor<T extends object>(key: string, db: BaseDatabase) {
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
