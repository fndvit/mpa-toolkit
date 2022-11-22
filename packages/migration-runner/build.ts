import fs from 'fs-extra';
import { Listr } from 'listr2';
import * as tsup from 'tsup';
import projectRoot from '@mpa/utils/projectRoot';
import { copyPrismaClientFiles } from '@mpa/utils/prisma/files';
import shell from 'shelljs';

const dist = 'dist';

const tasks = new Listr(
  [
    {
      title: 'Cleaning',
      task: () => (fs.pathExistsSync(dist) ? fs.rmSync(dist, { recursive: true }) : undefined)
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
        const root = await projectRoot();
        return fs.copy(`${root}/packages/db/prisma`, `${dist}/prisma`, { recursive: true });
      }
    },
    {
      title: 'Copying prisma client files',
      task: () => copyPrismaClientFiles(`${dist}/node_modules/.prisma/client`)
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
