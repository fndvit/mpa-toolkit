import { execFileSync } from 'child_process';
import { globby } from 'globby';

export async function prismaCmd(cmd: string) {
  const prismaScript = await globby('node_modules/**/prisma/build/index.js', { absolute: true });

  if (!prismaScript.length) throw new Error('Could not find prisma script');

  return new Promise((resolve, reject) => {
    const args = [prismaScript[0], ...cmd.split(' ')];
    try {
      execFileSync('node', args, { cwd: process.cwd() });
      resolve(0);
    } catch (err) {
      reject(err);
    }
  });
}
