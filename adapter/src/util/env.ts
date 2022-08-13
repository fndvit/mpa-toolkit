import dotenv from 'dotenv';
import { getPath } from './dirs';

export const getBaseEnvVars = (path: string, keys?: string[]) => {
  const dotenvConfig = dotenv.config({ path: getPath(path) });
  if (dotenvConfig.error) throw dotenvConfig.error;
  if (!dotenvConfig.parsed) throw new Error('Failed to load .env file');

  const env = dotenvConfig.parsed;

  const REQUIRED_ENV = ['PUBLIC_GOOGLE_OAUTH_CLIENT_ID', 'GOOGLE_OAUTH_CLIENT_SECRET', 'ORIGIN'];
  const missingEnv = REQUIRED_ENV.filter(key => !env[key]);
  if (missingEnv.length > 0) throw new Error(`Missing environment variables: ${missingEnv.join(', ')}`);

  if (keys) {
    return keys.reduce((acc, key) => {
      acc[key] = env[key];
      return acc;
    }, {});
  } else {
    return env;
  }
};
