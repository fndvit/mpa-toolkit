import type { StackProps } from 'aws-cdk-lib';
import {
  RemovalPolicy,
  Stack,
  aws_iam as iam,
  aws_lambda_event_sources as lambda_event_sources,
  aws_ec2 as ec2,
  aws_s3 as s3,
  App,
  CfnOutput
} from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import { getEnv } from '@mpa/env';
import { MaintenanceBox } from './constructs/MaintenanceBox';
import { Database } from './constructs/Database';
import { EventStack } from './constructs/EventStack';
import { LambdaLayers } from './constructs/LambdaLayers';
import { Server, SERVER_ENV_CONFIG } from './constructs/Server';
import { MigrationRunner, MIGRATION_RUNNER_ENV_CONFIG } from './constructs/MigrationRunner';
import { HttpApi } from './constructs/HttpApi';
import { Vpc } from './constructs/Vpc';
import { BucketDeployments } from './constructs/BucketDeployments';
import { CachePurger, CACHE_PURGER_ENV_CONFIG } from './constructs/CachePurger';
import { ImageOptimizer } from './constructs/ImageOptimizer';

const PRISMA_ENV = {
  PRISMA_QUERY_ENGINE_BINARY: '/opt/libquery_engine-rhel-openssl-1.0.x.so.node',
  PRISMA_QUERY_ENGINE_LIBRARY: '/opt/libquery_engine-rhel-openssl-1.0.x.so.node',
  PRISMA_MIGRATION_ENGINE_BINARY: '/opt/migration_engine-rhel-openssl-1.0.x',
  PRISMA_INTROSPECTION_ENGINE_BINARY: '/opt/introspection-engine-rhel-openssl-1.0.x',
  PRISMA_FMT_BINARY: '/opt/prisma-fmt-rhel-openssl-1.0.x'
};

const DB_PORT = 5432;

class SharedInfraStack extends Stack {
  staticBucket: s3.IBucket;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.staticBucket = new s3.Bucket(this, 'StaticBucket', {
      removalPolicy: RemovalPolicy.RETAIN,
      publicReadAccess: true
    });
  }
}

export interface MpathStackProps extends StackProps {
  stage: 'staging' | 'prod';
  shared: SharedInfraStack;
}

class MpathStack extends Stack {
  constructor(scope: Construct, id: string, props: MpathStackProps) {
    super(scope, id, props);

    const { stage, shared } = props;

    const bucket = shared.staticBucket;

    const vpc = new Vpc(this, 'Vpc');

    const db = new Database(this, 'Database', { vpc, port: DB_PORT, databaseName: 'mpa', stage });

    const lambdaLayers = new LambdaLayers(this, 'LambdaLayers');

    const server = new Server(this, 'Server', {
      vpc,
      bucket,
      stage,
      env: { ...getEnv(SERVER_ENV_CONFIG), ...PRISMA_ENV }
    });

    db.securityGroup.addIngressRule(server.lambdaSg, ec2.Port.tcp(DB_PORT));

    const migrationRunner = new MigrationRunner(this, 'MigrationRunner', {
      vpc,
      env: { ...getEnv(MIGRATION_RUNNER_ENV_CONFIG), ...PRISMA_ENV }
    });
    migrationRunner.lambda.addLayers(lambdaLayers.prismaEngineQuery, lambdaLayers.prismaEngineOther);
    migrationRunner.lambda.addEnvironment('DATABASE_URL', db.url);
    db.securityGroup.addIngressRule(migrationRunner.securityGroup, ec2.Port.tcp(DB_PORT));

    const { httpApi } = new HttpApi(this, 'HttpApi', { server });

    const cachePurger = new CachePurger(this, 'CachePurger', {
      vpc,
      env: getEnv(CACHE_PURGER_ENV_CONFIG)
    });
    const eventStack = new EventStack(this, 'EventStack', { vpc, stage });
    cachePurger.lambda.addEventSource(new lambda_event_sources.SqsEventSource(eventStack.queue, { batchSize: 10 }));

    Object.values(server.lambdas).forEach(({ fn, alias }) => {
      fn.addLayers(lambdaLayers.prismaEngineQuery);
      fn.addEnvironment('AWS_S3_UPLOAD_BUCKET', bucket.bucketName);
      fn.addEnvironment('DATABASE_URL', db.url);
      alias.addToRolePolicy(
        new iam.PolicyStatement({
          resources: ['*'],
          actions: ['appconfig:StartConfigurationSession', 'appconfig:GetLatestConfiguration']
        })
      );
      bucket.grantRead(alias);
      bucket.grantPut(alias, 'upload/*');
      eventStack.topic.grantPublish(alias);
      fn.addEnvironment('AWS_SNS_CONTENT_TOPIC', eventStack.topic.topicArn);
    });

    new ImageOptimizer(this, 'ImageOptimizer', { imageBucket: bucket });

    const maintananceBox = new MaintenanceBox(this, 'MaintenanceBox', { vpc });
    db.securityGroup.addIngressRule(maintananceBox.securityGroup, ec2.Port.tcp(DB_PORT));

    new CfnOutput(this, 'ContentTopicArn', {
      value: eventStack.topic.topicArn,
      description: "SNS topic 'content'"
    });

    new BucketDeployments(this, 'BucketDeployments', { bucket });

    new CfnOutput(this, `MigrationRunnerLambdaArn`, { value: migrationRunner.lambda.functionArn });
    new CfnOutput(this, 'HttpApiEndpoint', {
      value: httpApi.apiEndpoint,
      description: 'HTTP API default endpoint'
    });
    new CfnOutput(this, 'HttpApiURL', {
      value: httpApi.url!,
      description: 'HTTP API URL'
    });
  }
}

const app = new App();

// created the SharedInfraStack with the VPC resource that we're going to share by making a variable
const sharedInfra = new SharedInfraStack(app, 'MPAth-shared', {
  env: {
    account: '335671600435',
    region: 'eu-west-1'
  }
});

new MpathStack(app, 'MPAth-production', {
  env: {
    account: '335671600435',
    region: 'eu-west-1'
  },
  shared: sharedInfra,
  stage: 'prod'
});

new MpathStack(app, 'MPAth-staging', {
  env: {
    account: '335671600435',
    region: 'eu-west-1'
  },
  shared: sharedInfra,
  stage: 'staging'
});
