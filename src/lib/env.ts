import dotenv from 'dotenv';
dotenv.config();

interface MpaEnv {
  DATABASE_URL: string;
  GOOGLE_OAUTH_CLIENT_ID: string;
  GOOGLE_OAUTH_CLIENT_SECRET: string;
  JWT_SECRET_KEY: string;
  AWS_S3_CONTENT_BUCKET: string;
  AWS_EXECUTION_ENV?: string;
  LOG_TRANSPORT?: string;
  LAMBDA_TASK_ROOT?: string;
  ORIGIN: string;
}

const REQUIRED_ENV: (keyof MpaEnv)[] = [
  'DATABASE_URL', 'ORIGIN',
  'GOOGLE_OAUTH_CLIENT_ID', 'GOOGLE_OAUTH_CLIENT_SECRET',
  'JWT_SECRET_KEY', 'AWS_S3_CONTENT_BUCKET'
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processEnv: MpaEnv = process.env as any;

const missing = REQUIRED_ENV.filter(env => !processEnv[env]);
if (missing.length > 0) {
  throw new Error(`Missing environment variables: ${missing.join(', ')}`);
}

const originURL = new URL(processEnv.ORIGIN);

const env = {
  host: originURL.host,
  protocol: originURL.protocol.replace(':', ''),
  isLambda: !!(processEnv.LAMBDA_TASK_ROOT && processEnv.AWS_EXECUTION_ENV),
  databaseUrl: processEnv.DATABASE_URL,
  googleOAuthClientId: processEnv.GOOGLE_OAUTH_CLIENT_ID,
  googleOAuthClientSecret: processEnv.GOOGLE_OAUTH_CLIENT_SECRET,
  jwtSecret: processEnv.JWT_SECRET_KEY,
  logTransport: processEnv.LOG_TRANSPORT,
  s3contentBucket: processEnv.AWS_S3_CONTENT_BUCKET
};

export default env;
