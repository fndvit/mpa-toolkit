import dotenv from 'dotenv';

dotenv.config();

const ENV_REQUIRED = [
  'DATABASE_URL',
  'PUBLIC_GOOGLE_OAUTH_CLIENT_ID',
  'GOOGLE_OAUTH_CLIENT_SECRET',
  'JWT_SECRET_KEY',
  'AWS_S3_UPLOAD_BUCKET',
  'ORIGIN'
] as const;

const ENV_OPTIONAL = [
  'AWS_SNS_CONTENT_TOPIC',
  'AWS_EXECUTION_ENV',
  'LOG_TRANSPORT',
  'LAMBDA_TASK_ROOT',
  'FASTLY_API_KEY',
  'FASTLY_SERVICE_ID'
] as const;

type MpaEnv = Expand<{ [K in typeof ENV_REQUIRED[number]]: string } & { [K in typeof ENV_OPTIONAL[number]]?: string }>;

const missing = ENV_REQUIRED.filter(env => !process.env[env]);
if (missing.length > 0) {
  throw new Error(`Missing environment variables: ${missing.join(', ')}`);
}

const ALL_ENV = [...ENV_REQUIRED, ...ENV_OPTIONAL] as const;
const processEnv = ALL_ENV.reduce((acc, key) => {
  acc[key] = process.env[key];
  return acc;
}, {} as MpaEnv);

// const originURL = new URL(processEnv.ORIGIN);

const env = {
  ...processEnv,
  // host: originURL.host,
  // protocol: originURL.protocol.replace(':', ''),
  isLambda: !!(processEnv.LAMBDA_TASK_ROOT && processEnv.AWS_EXECUTION_ENV)
};

export default env;
