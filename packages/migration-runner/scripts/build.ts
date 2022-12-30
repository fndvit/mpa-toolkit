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
      // copy cached files if they exist
      if (fs.existsSync('pg_binaries') && fs.readdirSync('pg_binaries').length > 0) {
        task.output = 'Copying pre-existing files...';
        copy('pg_binaries', `${dist}/pg`, { recursive: true });
        task.output = 'Copied cached files';
        return;
      }

      // otherwise get them from docker

      task.output = 'Preparing...';
      shell.exec('docker rm -f migrationrunnerbuild', { silent: true });
      fs.rmSync('pg_binaries', { recursive: true, force: true });
      fs.mkdirSync('pg_binaries');

      task.output = 'Starting container...';
      shell.exec(
        `docker run \
        --name migrationrunnerbuild \
        -e POSTGRES_USER=prisma \
        -e POSTGRES_PASSWORD=prisma \
        -e POSTGRES_DB=mpa \
        --platform linux/amd64 \
        -v $(pwd)/pg_binaries:/pg_binaries \
        -v $(pwd)/scripts/copy.sh:/scripts/copy.sh:ro \
        -d \
        postgres:13`,
        { silent: true }
      );

      const removeContainer = () => shell.exec(`docker rm -f migrationrunnerbuild`, { silent: true });

      const waitForContainer = async () => {
        const startTime = Date.now();
        const timeout = 60;

        const elapsed = () => (Date.now() - startTime) / 1000;

        while (elapsed() < timeout) {
          const lastLogLine = shell.exec(`docker logs migrationrunnerbuild -n5`, { silent: true });

          if (/database system is ready to accept connections/g.test(lastLogLine)) return true;

          task.output = `Waiting for container to start... (${(timeout - elapsed()).toFixed(0)}s left)\n`;
          task.output += lastLogLine.split('\n').slice(-3).join('\n');
          await new Promise(resolve => setTimeout(resolve, 250));
        }
        return false;
      };

      const ready = await waitForContainer();

      if (!ready) {
        task.output = 'Container failed to start';
        removeContainer();
        throw new Error('Container failed to start');
      }

      task.output = `Container ready. Copying files...`;
      shell.exec(`docker exec migrationrunnerbuild bash /scripts/copy.sh`, { silent: true });

      task.output = 'Removing container...';
      removeContainer();

      task.output = 'Copying files...';
      await copy('pg_binaries', `${dist}/pg`, { recursive: true });

      task.output = '';
    },
    options: { persistentOutput: true }
  }
]);

tasks
  .run()
  .then(() => console.log('done'))
  .catch(err => console.error(`error`, err));
