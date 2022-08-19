import path from 'path';
import fs from 'fs';
import * as dotenv from 'dotenv';

export const IS_DEV = !(process.env.LAMBDA_TASK_ROOT && process.env.AWS_EXECUTION_ENV);

if (IS_DEV) {
  const PROJECT_ROOT = path.join(process.cwd(), '../..');
  dotenv.config({ path: path.join(PROJECT_ROOT, '.env') });
} else {
  dotenv.config();
}

const ENV_VARS = [
  'PUBLIC_GOOGLE_OAUTH_CLIENT_ID',
  'PUBLIC_UPLOAD_BASE_URL',
  'DATABASE_URL',
  'GOOGLE_OAUTH_CLIENT_SECRET',
  'JWT_SECRET_KEY',
  'AWS_S3_UPLOAD_BUCKET',
  'ORIGIN',
  'AWS_SNS_CONTENT_TOPIC',
  'AWS_EXECUTION_ENV',
  'LOG_TRANSPORT',
  'LOG_DB_QUERIES',
  'LOG_LEVEL',
  'LAMBDA_TASK_ROOT',
  'FASTLY_API_KEY',
  'FASTLY_SERVICE_ID'
] as const;

const REQUIRED = {
  SERVER: [
    'DATABASE_URL',
    'PUBLIC_GOOGLE_OAUTH_CLIENT_ID',
    'PUBLIC_UPLOAD_BASE_URL',
    'GOOGLE_OAUTH_CLIENT_SECRET',
    'JWT_SECRET_KEY',
    'AWS_S3_UPLOAD_BUCKET',
    'ORIGIN',
    'AWS_SNS_CONTENT_TOPIC',
    'FASTLY_API_KEY',
    'FASTLY_SERVICE_ID'
  ],
  DEV_SERVER: [
    'DATABASE_URL',
    'PUBLIC_GOOGLE_OAUTH_CLIENT_ID',
    'GOOGLE_OAUTH_CLIENT_SECRET',
    'JWT_SECRET_KEY',
    'AWS_S3_UPLOAD_BUCKET',
    'ORIGIN'
  ],
  MIGRATION_RUNNER: ['DATABASE_URL'],
  CACHE_PURGER: ['FASTLY_API_KEY', 'FASTLY_SERVICE_ID']
} as const;

type Environments = keyof typeof REQUIRED;

type MpaEnv = { [K in typeof ENV_VARS[number]]: string };

const processEnv = ENV_VARS.filter(key => process.env[key]).reduce((acc, key) => {
  acc[key] = process.env[key]!;
  return acc;
}, {} as MpaEnv);

function _checkEnvVars(env: MpaEnv, required: readonly (keyof MpaEnv)[]) {
  const missing = required.filter(key => !env[key]);
  if (missing.length > 0) throw new Error(`Missing environment variables: ${missing.join(', ')}`);
}

export function checkRequiredEnvVars(environment: Environments, vars: MpaEnv = processEnv) {
  _checkEnvVars(vars, REQUIRED[environment]);
}

export function getBaseEnvVars<K extends Environments>(envFilePath: string, environment: K) {
  const _env = dotenv.parse(fs.readFileSync(envFilePath, 'utf-8'));
  type KeyUnion = typeof REQUIRED[K][number];
  const keys = [...REQUIRED[environment]] as KeyUnion[];
  return keys.reduce((acc, key) => {
    acc[key] = _env[key];
    return acc;
  }, {} as { [K in KeyUnion]: string });
}

export default processEnv;
