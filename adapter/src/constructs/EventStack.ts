import { Construct } from 'constructs';
import {
  aws_sqs as sqs,
  aws_sns as sns,
  aws_ec2 as ec2,
  aws_lambda as lambda,
  aws_lambda_nodejs as lambda_nodejs,
  aws_lambda_event_sources as lambda_event_sources,
  aws_sns_subscriptions as subs,
  Duration
} from 'aws-cdk-lib';
import { getPath } from '../util/dirs';

export interface EventStackProps {
  vpc: ec2.IVpc;
}

export class EventStack extends Construct {
  topic: sns.Topic;
  dlq: sqs.Queue;
  queue: sqs.Queue;

  constructor(scope: Construct, id: string, props: EventStackProps) {
    super(scope, id);

    const { vpc } = props;

    // *********************
    // * Dead letter queue *
    // *********************

    this.dlq = new sqs.Queue(this, 'DLQ', { retentionPeriod: Duration.minutes(30) });

    // const dlqSg = new ec2.SecurityGroup(this, 'DLQ-SG', { vpc });

    const dlqLambda = new lambda_nodejs.NodejsFunction(this, 'DLQ-Lambda', {
      entry: './src/lambda/dlq.ts',
      memorySize: 1024,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'main',
      // securityGroups: [dlqSg],
      depsLockFilePath: getPath('yarn.lock'),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_NAT
      }
    });

    // ************************
    // * Topic & event queues *
    // ************************

    this.queue = new sqs.Queue(this, 'Queue', {
      deadLetterQueue: {
        queue: this.dlq,
        maxReceiveCount: 5
      }
    });

    this.topic = new sns.Topic(this, 'ContentTopic', { topicName: 'content' });

    this.topic.addSubscription(new subs.SqsSubscription(this.queue));

    dlqLambda.addEventSource(new lambda_event_sources.SqsEventSource(this.dlq));
  }
}
