import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';
import { PROJECT_ROOT } from './dirs';

const recursiveResolve = (path: string, pkgs: string[]) => {
  return pkgs.length ? recursiveResolve(`file://${createRequire(path).resolve(pkgs[0])}`, pkgs.slice(1)) : path;
};

const getPkgDir = (pkg: string[]) => {
  const main = recursiveResolve(import.meta.url, pkg);
  return path.dirname(main.slice('file://'.length));
};

export const getPrismaFileCopyCommands = (i: string, o: string) => {
  try {
    const clientFileDir = getPkgDir(['@mpa/db', '@prisma/client', `.prisma/client`]);

    const FILES_TO_COPY = ['libquery_engine-rhel-openssl-1.0.x.so.node'];

    const paths = FILES_TO_COPY.map(file => path.join(clientFileDir, file));

    const missing = paths.filter(file => !fs.existsSync(file));
    if (missing.length) {
      throw new Error(`Failed to find prisma client files: ${missing.join(', ')}`);
    }

    const meta = paths.map(f => ({
      from: path.relative(PROJECT_ROOT, f),
      to: f.split('/').pop()
    }));

    return meta.map(({ from, to }) => `cp ${i}/${from} ${o}/${to}`);
  } catch (e) {
    console.error('Failed to find prisma client file directory');
    throw e;
  }
};
