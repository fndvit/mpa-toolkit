export * from '@mpa/env';
import { getEnv } from '@mpa/env';

export const env = getEnv({
  // required
  PUBLIC_UPLOAD_BASE_URL: true,
  PUBLIC_GOOGLE_OAUTH_CLIENT_ID: true,
  GOOGLE_OAUTH_CLIENT_SECRET: true,
  LOG_TRANSPORT: true,
  // optional (prod only)
  DISABLE_CACHE: false,
  AWS_SNS_CONTENT_TOPIC: false,
  AWS_REGION: false,
  FASTLY_API_KEY: false,
  FASTLY_SERVICE_ID: false,
  PUBLIC_DB_RESTORE: false,
  // not avail in build
  DATABASE_URL: !process.env.CI,
  JWT_SECRET_KEY: !process.env.CI,
  AWS_S3_UPLOAD_BUCKET: !process.env.CI
});
