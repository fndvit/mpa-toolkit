import type { StackProps } from 'aws-cdk-lib';
import {
  Stack,
  aws_iam as iam,
  aws_lambda_event_sources as lambda_event_sources,
  aws_ec2 as ec2,
  App,
  CfnOutput
} from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import { getEnv } from '@mpa/env';
import { AppConfig } from './constructs/AppConfig';
import { MaintenanceBox } from './constructs/MaintenanceBox';
import { Database } from './constructs/Database';
import { EventStack } from './constructs/EventStack';
import { Buckets } from './constructs/Buckets';
import { LambdaLayers } from './constructs/LambdaLayers';
import { Server, SERVER_ENV_CONFIG } from './constructs/Server';
import { MigrationRunner, MIGRATION_RUNNER_ENV_CONFIG } from './constructs/MigrationRunner';
import { WebDistribution } from './constructs/WebDistribution';
import { Vpc } from './constructs/Vpc';
import { BucketDeployments } from './constructs/BucketDeployments';
import { CachePurger, CACHE_PURGER_ENV_CONFIG } from './constructs/CachePurger';

interface MpathStackProps extends StackProps {
  sentryArn: string;
  appConfigArn: string;
  stage: 'dev' | 'staging' | 'prod';
}

class MpathStack extends Stack {
  constructor(scope: Construct, id: string, props: MpathStackProps) {
    super(scope, id, props);

    const { sentryArn, appConfigArn, stage } = props;
    const DB_PORT = 5432;

    const buckets = new Buckets(this, 'Buckets');
    const vpc = new Vpc(this, 'Vpc');
    const db = new Database(this, 'Database', { vpc, port: DB_PORT, databaseName: 'mpa' });

    const lambdaLayers = new LambdaLayers(this, 'LambdaLayers', { sentryArn, appConfigArn });
    new AppConfig(this, 'AppConfig');

    const prismaEnv = {
      PRISMA_QUERY_ENGINE_BINARY: '/opt/libquery_engine-rhel-openssl-1.0.x.so.node',
      PRISMA_QUERY_ENGINE_LIBRARY: '/opt/libquery_engine-rhel-openssl-1.0.x.so.node',
      PRISMA_MIGRATION_ENGINE_BINARY: '/opt/migration_engine-rhel-openssl-1.0.x',
      PRISMA_INTROSPECTION_ENGINE_BINARY: '/opt/introspection-engine-rhel-openssl-1.0.x',
      PRISMA_FMT_BINARY: '/opt/prisma-fmt-rhel-openssl-1.0.x'
    };

    const server = new Server(this, 'Server', {
      vpc,
      prismaEngineLayer: lambdaLayers.prismaEngine,
      env: { ...getEnv(SERVER_ENV_CONFIG), ...prismaEnv }
    });

    server.lambda.addEnvironment('AWS_S3_UPLOAD_BUCKET', buckets.upload.bucketName);
    server.lambda.addEnvironment('DATABASE_URL', db.url);
    db.securityGroup.addIngressRule(server.lambdaSg, ec2.Port.tcp(DB_PORT));
    server.lambdaAlias.addToRolePolicy(
      new iam.PolicyStatement({
        resources: ['*'],
        actions: ['appconfig:StartConfigurationSession', 'appconfig:GetLatestConfiguration']
      })
    );

    buckets.upload.grantPut(server.lambdaAlias);

    const migrationRunner = new MigrationRunner(this, 'MigrationRunner', {
      vpc,
      prismaEngineLayer: lambdaLayers.prismaEngine,
      env: { ...getEnv(MIGRATION_RUNNER_ENV_CONFIG), ...prismaEnv }
    });
    migrationRunner.lambda.addEnvironment('DATABASE_URL', db.url);
    db.securityGroup.addIngressRule(migrationRunner.securityGroup, ec2.Port.tcp(DB_PORT));

    const { distribution, httpApi } = new WebDistribution(this, 'WebDistribution', { server, buckets });

    if (stage !== 'dev') {
      const cachePurger = new CachePurger(this, 'CachePurger', {
        vpc,
        env: getEnv(CACHE_PURGER_ENV_CONFIG)
      });
      const eventStack = new EventStack(this, 'EventStack', { vpc });
      cachePurger.lambda.addEventSource(new lambda_event_sources.SqsEventSource(eventStack.queue, { batchSize: 10 }));
      server.lambda.addEnvironment('AWS_SNS_CONTENT_TOPIC', eventStack.topic.topicArn);
      eventStack.topic.grantPublish(server.lambdaAlias);

      const maintananceBox = new MaintenanceBox(this, 'MaintenanceBox', { vpc });
      db.securityGroup.addIngressRule(maintananceBox.securityGroup, ec2.Port.tcp(DB_PORT));

      new CfnOutput(this, 'ContentTopicArn', { value: eventStack.topic.topicArn, description: "SNS topic 'content'" });
    }

    new BucketDeployments(this, 'BucketDeployments', { buckets, distribution });

    new CfnOutput(this, `MigrationRunnerLambdaArn`, { value: migrationRunner.lambda.functionArn });
    new CfnOutput(this, 'Domain', {
      value: distribution.distributionDomainName,
      description: 'Distribution domain name'
    });
    new CfnOutput(this, 'HttpApiEndpoint', {
      value: httpApi.apiEndpoint,
      description: 'HTTP API default endpoint'
    });
  }
}

const app = new App();

new MpathStack(app, 'MPAth-production', {
  env: {
    account: '335671600435',
    region: 'eu-west-1'
  },
  sentryArn: 'arn:aws:lambda:eu-west-1:943013980633:layer:SentryNodeServerlessSDK:73',
  appConfigArn: 'arn:aws:lambda:eu-west-1:434848589818:layer:AWS-AppConfig-Extension:69',
  stage: 'prod'
});

new MpathStack(app, 'MPAth-staging', {
  env: {
    account: '335671600435',
    region: 'eu-west-1'
  },
  sentryArn: 'arn:aws:lambda:eu-west-1:943013980633:layer:SentryNodeServerlessSDK:73',
  appConfigArn: 'arn:aws:lambda:eu-west-1:434848589818:layer:AWS-AppConfig-Extension:69',
  stage: 'staging'
});