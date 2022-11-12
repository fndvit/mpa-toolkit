import { execFile } from 'child_process';
import * as path from 'path';
import { getInstalledPath } from 'get-installed-path';

export async function prismaCmd(cmd: string) {
  const cwd = path.resolve(process.cwd(), '../db');
  const prismaPath = await getInstalledPath('prisma', { local: true, cwd });
  return new Promise((resolve, reject) => {
    const args = [path.resolve(prismaPath, 'build/index.js'), ...cmd.split(' ')];
    const opts = { cwd };
    execFile('node', args, opts, (error, stdout) => {
      if (error != null) {
        console.log(stdout);
        reject(error);
      } else {
        resolve(0);
      }
    });
  });
}
