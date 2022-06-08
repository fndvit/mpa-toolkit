import { prisma } from '../../src/lib/prisma';
import { execFile } from "child_process";
import * as path from "path";

async function dropAllFunctions() {
  const functionNames = await prisma.$queryRaw<{ name: string }[]>
    `SELECT routine_name as name FROM information_schema.routines
     WHERE routine_type = 'FUNCTION' AND routine_schema = 'public'`;

  return prisma.$transaction(
    functionNames.map(({ name }) =>
      prisma.$executeRawUnsafe(`DROP FUNCTION IF EXISTS ${name} CASCADE;`)
    )
  );
}

async function prismaReset() {
  return new Promise((resolve) => {
    execFile(
      path.resolve("./node_modules/prisma/build/index.js"),
      ["migrate", "reset", "--force" ],
      (error, stdout) => {
        if (error != null) {
          console.log(stdout);
          console.error(`prisma migrate exited with error ${error.message}`);
          resolve(error.code ?? 1);
        } else {
          resolve(0);
        }
      },
    );
  });
}

export async function reset() {
  console.log('Dropping all functions...');
  await dropAllFunctions();
  console.log('Running prisma reset...');
  await prismaReset();
}
