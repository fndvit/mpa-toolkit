import { execFile } from 'child_process';
import * as path from 'path';
import type { PrismaClient } from '@prisma/client';

async function dropAllFunctions(prisma: PrismaClient) {
  const functionNames = await prisma.$queryRaw<
    { name: string }[]
  >`SELECT routine_name as name FROM information_schema.routines
     WHERE routine_type = 'FUNCTION' AND routine_schema = 'public'`;

  return prisma.$transaction(
    functionNames.map(({ name }) => prisma.$executeRawUnsafe(`DROP FUNCTION IF EXISTS ${name} CASCADE;`))
  );
}

async function prismaCmd(cmd: string) {
  return new Promise((resolve, reject) => {
    execFile('node', [path.resolve('./node_modules/prisma/build/index.js'), ...cmd.split(' ')], (error, stdout) => {
      if (error != null) {
        console.log(stdout);
        reject(error);
      } else {
        resolve(0);
      }
    });
  });
}

export async function reset(prisma: PrismaClient) {
  console.log('Generating prisma client files...');
  await prismaCmd('generate');

  console.log('Dropping all functions...');
  await dropAllFunctions(prisma);

  console.log('Running prisma reset...');
  await prismaCmd('migrate reset --force');
}
