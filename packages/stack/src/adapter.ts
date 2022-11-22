import * as fs from 'fs';
import * as path from 'path';
import { posix } from 'path';
import { fileURLToPath } from 'url';
import type { Adapter } from '@sveltejs/kit';
import * as esbuild from 'esbuild';
import { copyPrismaEngineFiles, copyPrismaClientFiles } from '@mpa/utils/prisma/files';

export default function (): Adapter {
  return {
    name: 'adapter-awscdk',
    async adapt(builder) {
      const lambda = fileURLToPath(new URL('./lambda', import.meta.url).href);
      const server = builder.getBuildDirectory('server');
      const client = builder.getBuildDirectory('client');
      const prismaClient = builder.getBuildDirectory('prisma-client');
      const prismaEngine = builder.getBuildDirectory('prisma-engine');
      const router = builder.getBuildDirectory('router');
      const tmp = builder.getBuildDirectory('tmp');

      builder.rimraf(server);
      builder.rimraf(tmp);
      builder.mkdirp(tmp);
      builder.mkdirp(server);
      builder.mkdirp(router);
      builder.writeClient(client);

      await copyPrismaEngineFiles(prismaEngine);
      await copyPrismaClientFiles(prismaClient);

      const relativePath = posix.relative(server, builder.getServerDirectory());

      builder.copy(`${lambda}/server.js`, `${server}/index.js`, {
        replace: {
          SERVER: `${relativePath}/index.js`,
          MANIFEST: './manifest.js'
        }
      });

      fs.writeFileSync(
        `${server}/manifest.js`,
        `export const manifest = ${builder.generateManifest({ relativePath })};\n\n`
      );

      builder.copy(`${lambda}/router.js`, `${tmp}/_router.js`, { replace: { STATIC: './static.js' } });

      const staticFiles = [...getAllFiles(builder.getClientDirectory()), ...builder.prerendered.paths];

      fs.writeFileSync(`${tmp}/static.js`, `export const staticFiles = new Set(${JSON.stringify(staticFiles)});\n`);

      esbuild.buildSync({
        entryPoints: [`${tmp}/_router.js`],
        outfile: `${router}/index.js`,
        format: 'cjs',
        bundle: true,
        platform: 'node'
      });

      builder.log.minor('Done.');
    }
  };
}

const getAllFiles = function (dirPath: string, basePath?: string, arrayOfFiles: string[] = []) {
  basePath = basePath || dirPath;

  fs.readdirSync(dirPath).forEach(function (file) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, basePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join('/', dirPath.replace(basePath!, ''), '/', file));
    }
  });

  return arrayOfFiles;
};
