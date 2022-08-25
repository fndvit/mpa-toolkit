import type { Handler } from 'aws-lambda';
import { MpaDatabase } from '@mpa/db';
import { Seeder, reset, prismaCmd } from '@mpa/db/src/lib';
import { logger } from '@mpa/log';
import { env } from './env';

const log = logger('migration-runner');
// example cmd to invoke using aws cli:
// aws lambda invoke --function-name AppStack-MigrationRunner07C61515-63HtCcSdD3K6 response.json

export const handler: Handler = async event => {
  // Available commands are:
  //   deploy: create new database if absent and apply all migrations to the existing database.
  //   reset: delete existing database, create new one, and apply all migrations. NOT for production environment.
  // If you want to add commands, please refer to: https://www.prisma.io/docs/concepts/components/prisma-migrate
  const command: string = event.command ?? 'deploy';

  const db = new MpaDatabase(env.DATABASE_URL);
  const seeder = new Seeder(db);

  log.info(`Running migration command: ${command}`);

  if (command === 'seed') {
    await seeder.seed(event.seed === 'dev');
  } else if (command === 'seedmigrate') {
    await seeder.migrate();
  } else if (command === 'nuke') {
    await reset(db.prisma);
    await seeder.seed(event.seed === 'dev');
  } else if (command === 'reset') {
    await prismaCmd('migrate reset --force --skip-generate');
  } else if (command === 'deploy') {
    await prismaCmd('migrate deploy');
  }

  log.info(`Finished`);
};
