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
import { MaintenanceBox } from './constructs/MaintenanceBox';
import { Database } from './constructs/Database';
import { EventStack } from './constructs/EventStack';
import { LambdaLayers } from './constructs/LambdaLayers';
import { Server } from './constructs/Server';
import { MigrationRunner } from './constructs/MigrationRunner';
import { HttpApi } from './constructs/HttpApi';
import { Vpc } from './constructs/Vpc';
import { BucketDeployments } from './constructs/BucketDeployments';
import { CachePurger } from './constructs/CachePurger';
import { ImageOptimizer } from './constructs/ImageOptimizer';

const PRISMA_ENV = {
  PRISMA_QUERY_ENGINE_LIBRARY: '/opt/libquery_engine-rhel-openssl-1.0.x.so.node',
  PRISMA_MIGRATION_ENGINE_BINARY: '/opt/migration-engine-rhel-openssl-1.0.x',
  PRISMA_INTROSPECTION_ENGINE_BINARY: '/opt/introspection-engine-rhel-openssl-1.0.x',
  PRISMA_FMT_BINARY: '/opt/prisma-fmt-rhel-openssl-1.0.x'
};

const DB_PORT = 5432;

class SharedInfraStack extends Stack {
  assetBucket: s3.IBucket;
  adminBucket: s3.IBucket;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.assetBucket = new s3.Bucket(this, 'AssetBucket', {
      removalPolicy: RemovalPolicy.RETAIN,
      publicReadAccess: true
    });

    this.adminBucket = new s3.Bucket(this, 'AdminBucket', {
      removalPolicy: RemovalPolicy.RETAIN,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    });

    new CfnOutput(this, `AssetBucketName`, { value: this.assetBucket.bucketName });
    new CfnOutput(this, `AdminBucketName`, { value: this.adminBucket.bucketName });
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

    const { assetBucket, adminBucket } = shared;

    const vpc = new Vpc(this, 'Vpc');

    const db = new Database(this, 'Database', { vpc, port: DB_PORT, databaseName: 'mpa', stage });

    const lambdaLayers = new LambdaLayers(this, 'LambdaLayers');

    const server = new Server(this, 'Server', { vpc, assetBucket, stage, env: PRISMA_ENV });

    db.securityGroup.addIngressRule(server.lambdaSg, ec2.Port.tcp(DB_PORT));

    const migrationRunner = new MigrationRunner(this, 'MigrationRunner', {
      vpc,
      env: { ...PRISMA_ENV, STACK_NAME: this.stackName }
    });
    migrationRunner.lambda.addLayers(lambdaLayers.prismaEngineQuery, lambdaLayers.prismaEngineOther);
    migrationRunner.lambda.addEnvironment('DATABASE_URL', db.url);
    db.securityGroup.addIngressRule(migrationRunner.securityGroup, ec2.Port.tcp(DB_PORT));
    adminBucket.grantRead(migrationRunner.lambda);
    adminBucket.grantPut(migrationRunner.lambda);
    migrationRunner.lambda.addEnvironment('AWS_S3_ADMIN_BUCKET', adminBucket.bucketName);

    const { httpApi } = new HttpApi(this, 'HttpApi', { server });

    const cachePurger = new CachePurger(this, 'CachePurger', { vpc });
    const eventStack = new EventStack(this, 'EventStack', { vpc, stage });
    cachePurger.lambda.addEventSource(new lambda_event_sources.SqsEventSource(eventStack.queue, { batchSize: 10 }));

    Object.values(server.lambdas).forEach(({ fn, alias }) => {
      fn.addLayers(lambdaLayers.prismaEngineQuery);
      fn.addEnvironment('AWS_S3_UPLOAD_BUCKET', assetBucket.bucketName);
      fn.addEnvironment('DATABASE_URL', db.url);
      alias.addToRolePolicy(
        new iam.PolicyStatement({
          resources: ['*'],
          actions: ['appconfig:StartConfigurationSession', 'appconfig:GetLatestConfiguration']
        })
      );
      assetBucket.grantRead(alias);
      assetBucket.grantPut(alias, 'upload/*');
      eventStack.topic.grantPublish(alias);
      fn.addEnvironment('AWS_SNS_CONTENT_TOPIC', eventStack.topic.topicArn);
    });

    new ImageOptimizer(this, 'ImageOptimizer', { imageBucket: assetBucket });

    const maintananceBox = new MaintenanceBox(this, 'MaintenanceBox', { vpc });
    db.securityGroup.addIngressRule(maintananceBox.securityGroup, ec2.Port.tcp(DB_PORT));
    adminBucket.grantRead(maintananceBox.instance);
    adminBucket.grantPut(maintananceBox.instance);

    new CfnOutput(this, 'ContentTopicArn', {
      value: eventStack.topic.topicArn,
      description: "SNS topic 'content'"
    });

    new BucketDeployments(this, 'BucketDeployments', { assetBucket });

    new CfnOutput(this, `DatabaseURL`, { value: db.url });
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
  },
  tags: {
    Project: 'mpath',
    Environment: 'shared'
  }
});

new MpathStack(app, 'MPAth-production', {
  env: {
    account: '335671600435',
    region: 'eu-west-1'
  },
  shared: sharedInfra,
  stage: 'prod',
  tags: {
    Project: 'mpath',
    Environment: 'production'
  }
});

new MpathStack(app, 'MPAth-staging', {
  env: {
    account: '335671600435',
    region: 'eu-west-1'
  },
  shared: sharedInfra,
  stage: 'staging',
  tags: {
    Project: 'mpath',
    Environment: 'staging'
  }
});
