import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import env, { IS_DEV } from '@mpa/env';
import { logger } from '@mpa/log';

const sns = new SNSClient({});
const log = logger('events');

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

export type Event =
  | PageDeletedEvent
  | PageUpdatedEvent
  | PageCreatedEvent
  | TagDeletedEvent
  | TagUpdatedEvent
  | TagCreatedEvent;
export type EventByType<T extends Event['type']> = Extract<Event, { type: T }>;

export async function publishEvent<T extends Event['type']>(type: T, details: EventByType<T>['details']) {
  if (IS_DEV || !env.AWS_SNS_CONTENT_TOPIC) return;

  const event: Event = { type, details };
  const command = new PublishCommand({
    Message: JSON.stringify(event),
    TopicArn: env.AWS_SNS_CONTENT_TOPIC
  });

  try {
    await sns.send(command);
    log.info({ command }, 'Published event');
  } catch (error) {
    log.error({ error, command }, 'Failed to publish object');
    // TODO: need notifications here
    // as broken cache purging is critical
  } finally {
    // finally.
  }
}
