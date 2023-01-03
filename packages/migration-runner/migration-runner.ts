import type { Handler } from 'aws-lambda';
import { DbSeeder, initDatabase } from '@mpa/db';
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
  dumpKey: string;
}
interface SqlDumpPayload {
  command: 'sql_dump';
  dumpType: 'manual' | 'scheduled' | 'pipe';
}

type CmdWithArguments = (SqlLoadPayload | SqlDumpPayload)['command'];

interface CommandPayload {
  command: Exclude<typeof VALID_COMMANDS[number], CmdWithArguments>;
}

export type Payload = CommandPayload | SqlLoadPayload | SqlDumpPayload;

const getDatabaseParams = () => {
  const [, user, pass, host, port, database] =
    env.DATABASE_URL.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/) || [];
  if (!user || !pass || !host || !port || !database) throw new Error('Invalid DATABASE_URL');
  return { user, pass, host, port, database };
};

export type SqlDump = Awaited<ReturnType<typeof sqlDump>>;
const sqlDump = async ({ dumpType }: SqlDumpPayload) => {
  if (!dumpType) throw new Error('dumpType is required');

  const { user, pass, host, port, database } = getDatabaseParams();
  log.info(`Dumping database: ${database}`);
  const output = execSync(`./pg/pg_dump -h ${host} -p ${port} -U ${user} -d ${database}`, {
    env: {
      PGPASSWORD: pass,
      LD_LIBRARY_PATH: './pg'
    },
    encoding: 'utf-8'
  });

  if (dumpType === 'pipe') {
    return { output } as { output: string };
  }

  const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
  const timestampedKey = `dumps/${dumpType}/${env.STACK_NAME}-${timestamp}.sql`;
  const location = `s3://${env.AWS_S3_ADMIN_BUCKET}/${timestampedKey}`;

  log.info(`Uploading dump to ${location}`);
  const response = await s3
    .putObject({
      Bucket: env.AWS_S3_ADMIN_BUCKET,
      Key: timestampedKey,
      Body: output,
      ContentType: 'text/plain'
    })
    .promise();

  const bytes = Buffer.byteLength(output);

  if (!response.$response.error) log.info(`Uploaded ${bytes.toLocaleString()} bytes to ${location}`);
  else log.error(response.$response.error);

  return {
    location,
    key: timestampedKey,
    bytes
  };
};

const sqlLoad = async ({ dumpKey }: SqlLoadPayload) => {
  const { user, pass, host, port, database } = getDatabaseParams();

  log.info(`Loading dump from s3://${env.AWS_S3_ADMIN_BUCKET}/${dumpKey}`);
  const { Body } = await s3.getObject({ Bucket: env.AWS_S3_ADMIN_BUCKET, Key: dumpKey }).promise();
  if (!Body) throw new Error(`Could not find dump with key: ${dumpKey}`);

  log.info('Cleaning database');
  const cleanOutput = execSync(`./pg/psql -h ${host} -p ${port} -U ${user} -d ${database}`, {
    input: 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;',
    env: {
      PGPASSWORD: pass,
      LD_LIBRARY_PATH: './pg'
    },
    encoding: 'utf-8'
  });
  log.info(cleanOutput);

  log.info(`Loading dump into database: ${database}`);
  const output = execSync(`./pg/psql -h ${host} -p ${port} -U ${user} -d ${database}`, {
    input: Body.toString(),
    env: {
      PGPASSWORD: pass,
      LD_LIBRARY_PATH: './pg'
    },
    encoding: 'utf-8'
  });

  log.info(output);

  return {
    output
  };
};

export const handler: Handler = async event => {
  const payload = event as Payload;
  if (!payload.command) throw new Error('No command specified');
  if (!VALID_COMMANDS.includes(payload.command)) throw new Error(`Invalid command: ${payload.command}`);

  log.info(`Running migration command: ${payload.command}`);

  if (payload.command === 'seed') await new DbSeeder(initDatabase()).migrate();
  else if (payload.command === 'reset') return prismaCmd('migrate reset --force --skip-generate');
  else if (payload.command === 'deploy') return prismaCmd('migrate deploy');
  else if (payload.command === 'sql_dump') return sqlDump(payload);
  else if (payload.command === 'sql_load') return sqlLoad(payload);
};
