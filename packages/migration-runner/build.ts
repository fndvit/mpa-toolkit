import fs from 'fs';
import { copy } from 'fs-extra';
import { Listr } from 'listr2';
import * as tsup from 'tsup';
import projectRoot from '@mpa/utils/projectRoot';
import { copyPrismaClientFiles } from '@mpa/utils/prisma/files';
import shell from 'shelljs';
import decompress from 'decompress';
import fetch from 'node-fetch';

const dist = 'dist';

const tasks = new Listr(
  [
    {
      title: 'Cleaning',
      task: () => (fs.existsSync(dist) ? fs.rmSync(dist, { recursive: true }) : undefined)
    },
    {
      title: 'Building',
      task: () => tsup.build({ silent: true })
    },
    {
      title: 'Bundling dependencies',
      task: () => {
        return new Promise((resolve, reject) => {
          const { dependencies } = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
          fs.writeFileSync(`${dist}/package.json`, JSON.stringify({ dependencies }, null, 2));
          shell.exec(
            'npm i',
            { cwd: dist, silent: true, env: { ...process.env, PRISMA_CLI_BINARY_TARGETS: 'none' } },
            (code, stdout, stderr) => (code !== 0 ? reject(stderr) : resolve(stdout))
          );
        });
      }
    },
    {
      title: 'Copying prisma files',
      task: async () => {
        return copy(projectRoot('packages/db/prisma'), `${dist}/prisma`, { recursive: true });
      }
    },
    {
      title: 'Copying prisma client files',
      task: () => copyPrismaClientFiles(`${dist}/node_modules/.prisma/client`)
    },
    {
      title: 'Copying PostgreSQL files',
      task: async () => {
        const cache = projectRoot('node_modules/.cache/pgdump-aws-lambda');

        if (!fs.existsSync(cache) || !fs.readdirSync(cache).length) {
          fs.mkdirSync(cache, { recursive: true });
          const URL = 'https://github.com/jameshy/pgdump-aws-lambda/releases/download/v1.5.1/pgdump-aws-lambda.zip';
          const buffer = await fetch(URL)
            .then(res => res.arrayBuffer())
            .then(arrayBuf => Buffer.from(arrayBuf));

          await decompress(buffer, cache, {
            filter: file => file.path.startsWith('bin/postgres-14.5/'),
            map: file => ({
              ...file,
              path: file.path.replace('bin/postgres-14.5/', '')
            })
          });
        }
        await copy(cache, `${dist}/pg`, { recursive: true });
      }
    }
  ]
  // {
  //   renderer: 'simple'
  // }
);

tasks
  .run()
  .then(() => console.log('done'))
  .catch(err => console.error(`error`, err));
