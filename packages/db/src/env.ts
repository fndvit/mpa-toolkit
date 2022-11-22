import { getEnv } from '@mpa/env';

export const env = getEnv({
  DATABASE_URL: !process.env.CI,
  LOG_DB_QUERIES: false,
  LOG_TRANSPORT: false
});
