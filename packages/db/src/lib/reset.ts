import type { PrismaClient } from '@prisma/client';
import { prismaCmd } from './cmd';

async function dropAllFunctions(prisma: PrismaClient) {
  const functionNames = await prisma.$queryRaw<
    { name: string }[]
  >`SELECT routine_name as name FROM information_schema.routines
     WHERE routine_type = 'FUNCTION' AND routine_schema = 'public'`;

  return prisma.$transaction(
    functionNames.map(({ name }) => prisma.$executeRawUnsafe(`DROP FUNCTION IF EXISTS ${name} CASCADE;`))
  );
}

export async function reset(prisma: PrismaClient) {
  console.log('Generating prisma client files...');
  await prismaCmd('generate');

  console.log('Dropping all functions...');
  await dropAllFunctions(prisma);

  console.log('Running prisma reset...');
  await prismaCmd('migrate reset --force');
}
