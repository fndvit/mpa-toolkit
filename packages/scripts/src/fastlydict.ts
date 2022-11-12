import path from 'path';
import got, { HTTPError } from 'got';
import { getEnv } from '@mpa/env';
import { logger } from '@mpa/log';
import { globby } from 'globby';
import projectRoot from '@mpa/utils/projectRoot';

const log = logger('SCRIPTS');

const env = getEnv({
  FASTLY_API_KEY: true,
  FASTLY_SERVICE_ID: true,
  FASTLY_ROUTING_DICTIONARY_ID: true
});

const client = got.extend({
  prefixUrl: `https://api.fastly.com/service/${env.FASTLY_SERVICE_ID}/`,
  headers: {
    'Fastly-Key': env.FASTLY_API_KEY,
    Accept: 'application/json'
  }
});

export async function main() {
  const root = await projectRoot();
  const clientDir = path.resolve(root, 'packages/web/.svelte-kit/client');
  const files = await globby('**/*', { cwd: clientDir });
  log.info(`Globbing ${clientDir}/**/*`);

  console.log(`Found ${files.length} files`);

  const body = {
    items: files.map(file => ({
      op: 'upsert',
      item_key: `/${file}`,
      item_value: 'static'
    }))
  };

  try {
    const response = await client.patch(`dictionary/${env.FASTLY_ROUTING_DICTIONARY_ID}/items`, {
      json: body
    });
    log.info(`${response.statusCode} - ${response.statusMessage}`);
  } catch (err) {
    if (err instanceof HTTPError) {
      const { statusCode, statusMessage } = err.response;
      log.error(err.response.url);
      log.error(err.response.body);
      log.error(`${statusCode} - ${statusMessage}`);
    } else {
      log.error(err);
    }
  }
}

main()
  .catch(err => log.error(err))
  .then(() => log.info('done'));
