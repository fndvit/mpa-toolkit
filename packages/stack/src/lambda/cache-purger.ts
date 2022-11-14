import http from 'http';
import type { Event } from '@mpa/events';
import type { APIGatewayProxyResultV2, SQSEvent } from 'aws-lambda';
import got from 'got';
import { getEnv } from '@mpa/env';
import AWSSDK from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk-core';

AWSXRay.captureAWS(AWSSDK);
AWSXRay.captureHTTPsGlobal(http);

const log = AWSXRay.getLogger();

const env = getEnv({ FASTLY_API_KEY: true, FASTLY_SERVICE_ID: true });

type SuccessfulPurge = {
  status: 'ok';
};

type FailedPurge = {
  status: 'error';
  error: unknown;
};

type PurgeResponse = SuccessfulPurge | FailedPurge;

type EventOutput = PurgeResponse & {
  event: Event;
};

async function purgeSurrogates(keys: string[]): Promise<PurgeResponse> {
  log.info(`purging surrgate keys: '${keys.join(', ')}`);

  const response = got.post(`https://api.fastly.com/service/${env.FASTLY_SERVICE_ID}/purge`, {
    headers: {
      'Fastly-Key': env.FASTLY_API_KEY,
      'fastly-soft-purge': '1',
      Accept: 'application/json'
    },
    json: { surrogate_keys: keys }
  });

  if ((await response).ok) {
    return { status: 'ok' };
  } else {
    return { status: 'error', error: await response.json() };
  }
}

async function getSurrogateKeys(event: Event) {
  switch (event.type) {
    case 'page-deleted':
    case 'page-updated':
      return [`page-${event.details.id}`, 'pages'];
    case 'tag-deleted':
    case 'tag-updated':
      return [`tag-${event.details.id}`, 'tags'];
    case 'author-deleted':
    case 'author-updated':
      return [`author-${event.details.id}`, 'authors'];
    case 'page-created':
      return ['pages'];
    case 'tag-created':
      return [];
    case 'homepage-components-updated':
      return ['homepage'];
    default:
      log.error(`unknown event type: ${JSON.stringify(event)}`);
      return null;
  }
}

async function processEvent(event: Event): Promise<EventOutput> {
  const surrogateKeys = await getSurrogateKeys(event);
  if (surrogateKeys === null) {
    return { status: 'error', error: 'unknown event type', event };
  } else if (surrogateKeys.length === 0) {
    return { status: 'ok', event };
  } else {
    const response = await purgeSurrogates(surrogateKeys);
    return { ...response, event };
  }
}

export async function main(event: SQSEvent): Promise<APIGatewayProxyResultV2> {
  const events = event.Records.map(record => {
    const body = JSON.parse(record.body) as { Message: string };
    return JSON.parse(body.Message) as Event;
  });

  const results = await AWSXRay.captureAsyncFunc('processEvents', subseg => {
    subseg?.addMetadata('events', events);
    return Promise.all(events.map(processEvent));
  });

  log.info('results 👉', JSON.stringify(results, null, 2));

  return {
    body: JSON.stringify({ results }),
    statusCode: 200
  };
}
