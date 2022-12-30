import type { Handler } from 'aws-lambda';
import { DevSeeder, ProdSeeder, reset, initDatabase } from '@mpa/db';
import { prismaCmd } from '@mpa/utils/prisma/cmd';
import { logger } from '@mpa/log';
import { getEnv } from '@mpa/env';
import { execFileSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

export const env = getEnv({ DATABASE_URL: true });

const log = logger('migration-runner');
// example cmd to invoke using aws cli:
// aws lambda invoke --function-name AppStack-MigrationRunner07C61515-63HtCcSdD3K6 response.json

const VALID_COMMANDS = ['seed', 'seed:dev', 'nuke', 'reset', 'deploy', 'sql_dump', 'sql_load'] as const;

interface CommandPayload {
  command: Exclude<typeof VALID_COMMANDS[number], 'sql_load'>;
}

interface SqlLoadPayload {
  command: 'sql_load';
  sql: string;
}

export type Payload = CommandPayload | SqlLoadPayload;

export const handler: Handler = async event => {
  // Available commands are:
  //   deploy: create new database if absent and apply all migrations to the existing database.
  //   reset: delete existing database, create new one, and apply all migrations. NOT for production environment.
  // If you want to add commands, please refer to: https://www.prisma.io/docs/concepts/components/prisma-migrate

  const payload = event as Payload;

  if (!payload.command) throw new Error('No command specified');

  if (!VALID_COMMANDS.includes(payload.command)) throw new Error(`Invalid command: ${payload.command}`);

  const db = initDatabase();

  log.info(`Running migration command: ${payload.command}`);

  if (payload.command === 'seed') {
    const seeder = new ProdSeeder(db);
    await seeder.migrate();
  } else if (payload.command === 'seed:dev') {
    const seeder = new DevSeeder(db);
    await seeder.seed();
  } else if (payload.command === 'nuke') {
    const seeder = new ProdSeeder(db);
    await reset(db.prisma);
    await seeder.migrate();
  } else if (payload.command === 'reset') {
    await prismaCmd('migrate reset --force --skip-generate');
  } else if (payload.command === 'deploy') {
    await prismaCmd('migrate deploy');
  } else if (payload.command === 'sql_dump') {
    const [, user, pass, host, port, database] =
      env.DATABASE_URL.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/) || [];
    if (!user || !pass || !host || !port || !database) throw new Error('Invalid DATABASE_URL');
    execFileSync('./pg/pg_dump', ['-h', host, '-p', port, '-U', user, '-d', database], {
      env: {
        PGPASSWORD: pass,
        LD_LIBRARY_PATH: path.resolve('./pg')
      }
    });
  } else if (payload.command === 'sql_load') {
    throw new Error('Not implemented');
  }

  log.info(`Finished`);
};
