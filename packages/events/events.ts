import SNSClient, { type PublishInput } from 'aws-sdk/clients/sns.js';
import { getEnv } from '@mpa/env';
import { logger } from '@mpa/log';

const env = getEnv({ AWS_SNS_CONTENT_TOPIC: false });

const sns = new SNSClient({});
const log = logger('EVENTS');

export type PageDeletedEvent = {
  type: 'page-deleted';
  details: { id: number };
};

export type PageUpdatedEvent = {
  type: 'page-updated';
  details: { id: number };
};

export type PageCreatedEvent = {
  type: 'page-created';
  details: { id: number };
};

export type TagDeletedEvent = {
  type: 'tag-deleted';
  details: { id: number };
};

export type TagUpdatedEvent = {
  type: 'tag-updated';
  details: { id: number };
};

export type TagCreatedEvent = {
  type: 'tag-created';
  details: { id: number };
};

export type HomepageComponentsUpdatedEvent = {
  type: 'homepage-components-updated';
};

export type AuthorDeletedEvent = {
  type: 'author-deleted';
  details: { id: number };
};

export type AuthorUpdatedEvent = {
  type: 'author-updated';
  details: { id: number };
};

export type AuthorCreatedEvent = {
  type: 'author-created';
  details: { id: number };
};

export type Event =
  | PageDeletedEvent
  | PageUpdatedEvent
  | PageCreatedEvent
  | TagDeletedEvent
  | TagUpdatedEvent
  | TagCreatedEvent
  | AuthorDeletedEvent
  | AuthorUpdatedEvent
  | AuthorCreatedEvent
  | HomepageComponentsUpdatedEvent;

export type EventByType<T extends Event['type']> = Extract<Event, { type: T }>;
export type EventDetails<T extends Event['type']> = EventByType<T> extends { details: infer D } ? D : never;

export async function publishEvent(type: HomepageComponentsUpdatedEvent['type']): Promise<void>;
export async function publishEvent<T extends Event['type']>(type: T, details: EventDetails<T>): Promise<void>;
export async function publishEvent<T extends Event['type']>(type: T, details?: EventDetails<T>) {
  if (!env.AWS_SNS_CONTENT_TOPIC) return;

  const event = { type, details };

  const params: PublishInput = {
    Message: JSON.stringify(event),
    TopicArn: env.AWS_SNS_CONTENT_TOPIC
  };

  try {
    const request = sns.publish(params);
    const response = await request.promise();
    if (response.$response.error) throw response.$response.error;
    log.info({ params }, 'Published event');
  } catch (error) {
    log.error({ error, params }, 'Failed to publish object');
    // TODO: need notifications here
    // as broken cache purging is critical
  } finally {
    // finally.
  }
}
