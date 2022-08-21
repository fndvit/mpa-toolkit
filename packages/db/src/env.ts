import { getEnv } from '@mpa/env';

export const env = getEnv({
  DATABASE_URL: true,
  LOG_DB_QUERIES: false,
  LOG_TRANSPORT: false
});
