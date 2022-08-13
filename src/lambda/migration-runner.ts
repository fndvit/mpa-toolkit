import type { Handler } from 'aws-lambda';
import { execFile } from 'child_process';
import path from 'path';
import { checkRequiredEnvVars } from '../lib/env';
import { seed } from '../../prisma/lib/seed';
import { reset } from '../../prisma/lib/reset';

// example cmd to invoke using aws cli:
// aws lambda invoke --function-name AppStack-MigrationRunner07C61515-63HtCcSdD3K6 response.json

export const handler: Handler = async event => {
  checkRequiredEnvVars('MIGRATION_RUNNER');

  // Available commands are:
  //   deploy: create new database if absent and apply all migrations to the existing database.
  //   reset: delete existing database, create new one, and apply all migrations. NOT for production environment.
  // If you want to add commands, please refer to: https://www.prisma.io/docs/concepts/components/prisma-migrate
  const command: string = event.command ?? 'deploy';

  if (command === 'seed') {
    await seed(event.seed === 'dev');
  } else if (command === 'nuke') {
    await reset();
    await seed(event.seed === 'dev');
  } else if (command === 'reset' || command === 'deploy') {
    const options: string[] = command == 'reset' ? ['--force', '--skip-generate'] : [];

    // Currently we don't have any direct method to invoke prisma migration programatically.
    // As a workaround, we spawn migration script as a child process and wait for its completion.
    // Please also refer to the following GitHub issue: https://github.com/prisma/prisma/issues/4703
    try {
      const exitCode = await new Promise(resolve => {
        execFile(
          path.resolve('./node_modules/prisma/build/index.js'),
          ['migrate', command, ...options],
          (error, stdout) => {
            console.log(stdout);
            if (error != null) {
              console.log(`prisma migrate ${command} exited with error ${error.message}`);
              resolve(error.code ?? 1);
            } else {
              resolve(0);
            }
          }
        );
      });

      if (exitCode != 0) throw Error(`command ${command} failed with exit code ${exitCode}`);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
};
