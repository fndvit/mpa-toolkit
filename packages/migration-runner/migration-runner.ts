import type { Handler } from 'aws-lambda';
import { DevSeeder, ProdSeeder, initDatabase } from '@mpa/db';
import { prismaCmd } from '@mpa/utils/prisma/cmd';
import { logger } from '@mpa/log';
import { getEnv } from '@mpa/env';
import { execSync } from 'child_process';
import AWS from 'aws-sdk';

const s3 = new AWS.S3();

export const env = getEnv({ DATABASE_URL: true, STACK_NAME: true, AWS_S3_ADMIN_BUCKET: true });

const log = logger('migration-runner');

const VALID_COMMANDS = ['seed', 'seed:dev', 'reset', 'deploy', 'sql_dump', 'sql_load'] as const;

interface SqlLoadPayload {
  command: 'sql_load';
  sql: string;
}
interface SqlDumpPayload {
  command: 'sql_dump';
  dumpType: 'manual' | 'scheduled';
}

type CmdWithArguments = (SqlLoadPayload | SqlDumpPayload)['command'];

interface CommandPayload {
  command: Exclude<typeof VALID_COMMANDS[number], CmdWithArguments>;
}

export type Payload = CommandPayload | SqlLoadPayload | SqlDumpPayload;

const sqlDump = async ({ dumpType }: SqlDumpPayload) => {
  if (!dumpType) throw new Error('dumpType is required');

  const [, user, pass, host, port, database] =
    env.DATABASE_URL.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/) || [];
  if (!user || !pass || !host || !port || !database) throw new Error('Invalid DATABASE_URL');
  const output = execSync(`./pg/pg_dump -h ${host} -p ${port} -U ${user} -d ${database}`, {
    env: {
      PGPASSWORD: pass,
      LD_LIBRARY_PATH: './pg'
    },
    encoding: 'utf-8'
  });

  const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
  const timestampedKey = `dumps/${dumpType}/${env.STACK_NAME}-${timestamp}.sql`;

  const request = s3.putObject({
    Bucket: env.AWS_S3_ADMIN_BUCKET,
    Key: timestampedKey,
    Body: output,
    ContentType: 'text/plain'
  });
  const resp = await request.promise();

  const bytes = Buffer.byteLength(output).toLocaleString();
  const location = `s3://${env.AWS_S3_ADMIN_BUCKET}/${timestampedKey}`;

  if (!resp.$response.error) log.info(`Uploaded ${bytes} bytes to ${location}`);
  else log.error(resp.$response.error);

  return {
    location,
    bytes
  };
};

export const handler: Handler = async event => {
  const payload = event as Payload;
  if (!payload.command) throw new Error('No command specified');
  if (!VALID_COMMANDS.includes(payload.command)) throw new Error(`Invalid command: ${payload.command}`);

  log.info(`Running migration command: ${payload.command}`);

  if (payload.command === 'seed') await new ProdSeeder(initDatabase()).migrate();
  else if (payload.command === 'seed:dev') await new DevSeeder(initDatabase()).seed();
  else if (payload.command === 'reset') return prismaCmd('migrate reset --force --skip-generate');
  else if (payload.command === 'deploy') return prismaCmd('migrate deploy');
  else if (payload.command === 'sql_dump') return sqlDump(payload);
  else if (payload.command === 'sql_load') throw new Error('Not implemented');
};
