import path from 'path';
import shell from 'shelljs';
import fs from 'fs-extra';
import { globby } from 'globby';
import projectRoot from '../projectRoot';

const getPrismaVersion = () => {
  const match = shell.exec('pnpm -w ls -p', { silent: true }).stdout.match(/prisma@(?<version>\d.*?)\//);
  if (!match?.groups?.version) throw new Error(`Could not find prisma version`);
  return match.groups.version;
};

export async function copyPrismaEngineFiles(outdir: string, matchers: Record<string, RegExp>) {
  const prismaVer = getPrismaVersion();

  const cache = `${await projectRoot()}/node_modules/.cache/prisma@${prismaVer}`;

  fs.mkdirpSync(outdir);

  if (!fs.pathExistsSync(cache)) {
    fs.mkdirpSync(cache);
    shell.exec(`PRISMA_CLI_BINARY_TARGETS=rhel-openssl-1.0.x npm install --prefix ${cache} prisma@${prismaVer}`, {
      silent: true
    });
  }

  const engineFiles = await globby(`${cache}/**/engines/*rhel*`);
  engineFiles.forEach(file => {
    const dir = Object.keys(matchers).find(key => matchers[key].test(file));
    if (!dir) return;
    const destPath = path.join(outdir, dir);
    fs.mkdirpSync(destPath);
    shell.cp(file, destPath);
  });
}

export async function copyPrismaClientFiles(dest: string) {
  const dir = await globby('node_modules/**/.prisma/client', {
    cwd: await projectRoot(),
    dot: true,
    onlyDirectories: true,
    absolute: true
  });

  if (!dir.length) throw new Error('Could not find prisma client directory');

  const files = await globby('**/*', { cwd: dir[0], ignore: ['**/*.node'] });

  fs.mkdirSync(dest, { recursive: true });
  files.forEach(file => {
    fs.mkdirpSync(path.dirname(`${dest}/${file}`));
    fs.copyFileSync(`${dir[0]}/${file}`, `${dest}/${file}`);
  });
}
