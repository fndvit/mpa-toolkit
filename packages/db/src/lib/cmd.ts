// import { Prisma, PrismaClient } from '@prisma/client';
import { execFile } from 'child_process';
import * as path from 'path';

// Prisma
// PrismaClient

export async function prismaCmd(cmd: string) {
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
