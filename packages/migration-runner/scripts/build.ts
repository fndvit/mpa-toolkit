import fs from 'fs';
import { copy } from 'fs-extra';
import { Listr } from 'listr2';
import * as tsup from 'tsup';
import projectRoot from '@mpa/utils/projectRoot';
import { copyPrismaClientFiles } from '@mpa/utils/prisma/files';
import shell from 'shelljs';

const dist = 'dist';

const tasks = new Listr([
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
    task: async (_, task) => {
      const steps = [
        ['Cleanup', 'docker rm -f migrationrunnerbuild'],
        ['Building Docker image', 'docker build -t migrationrunnerbuild --platform linux/amd64 .'],
        ['Creating container', 'docker create --platform linux/amd64 --name migrationrunnerbuild migrationrunnerbuild'],
        ['Copying files', 'docker cp migrationrunnerbuild:/pg_binaries dist/pg'],
        ['Removing container', 'docker rm -f migrationrunnerbuild']
      ];

      for (const [title, command] of steps) {
        task.output = title;
        const output = shell.exec(command, { silent: true });
        if (output.code !== 0) {
          throw new Error(`Error at step ${title}\n\nCommand: ${command}\n\n${output.stderr}`);
        }
      }

      task.output = '';
    },
    options: { persistentOutput: true }
  }
]);

tasks
  .run()
  .then(() => console.log('done'))
  .catch(err => console.error(`error`, err));
