import dotenv from 'dotenv';

dotenv.config();

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
  'LAMBDA_TASK_ROOT',
  'FASTLY_API_KEY',
  'FASTLY_SERVICE_ID'
] as const;

const REQUIRED = {
  SERVER: [
    'DATABASE_URL',
    'PUBLIC_GOOGLE_OAUTH_CLIENT_ID',
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

type MpaEnv = Expand<{ [K in typeof ENV_VARS[number]]: string }>;

const processEnv = ENV_VARS.reduce((acc, key) => {
  acc[key] = process.env[key];
  return acc;
}, {} as MpaEnv);

export function checkRequiredEnvVars(environment: keyof typeof REQUIRED, vars: MpaEnv = processEnv) {
  const missing = REQUIRED[environment].filter(key => !vars[key]);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
}

export default {
  ...processEnv,
  IS_DEV: !(processEnv.LAMBDA_TASK_ROOT && processEnv.AWS_EXECUTION_ENV)
};
