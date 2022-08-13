import {
  Stack,
  aws_iam as iam,
  aws_lambda_event_sources as lambda_event_sources,
  aws_ec2 as ec2,
  StackProps,
  App,
  CfnOutput
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AppConfig } from './constructs/appconfig';
import { MaintenanceBox } from './constructs/MaintenanceBox';
import { Database } from './constructs/Database';
import { EventStack } from './constructs/EventStack';
import { Buckets } from './constructs/Buckets';
import { PrismaLayers } from './constructs/PrismaLayers';
import { Server } from './constructs/Server';
import { MigrationRunner } from './constructs/MigrationRunner';
import { WebDistribution } from './constructs/WebDistribution';
import { Vpc } from './constructs/Vpc';
import { BucketDeployments } from './constructs/BucketDeployments';
import { CachePurger } from './constructs/CachePurger';

class AWSAdapterStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const buckets = new Buckets(this, 'Buckets');

    const vpc = new Vpc(this, 'Vpc');

    const cachePurger = new CachePurger(this, 'CachePurger', { vpc });

    const eventStack = new EventStack(this, 'EventStack', { vpc });

    cachePurger.lambda.addEventSource(new lambda_event_sources.SqsEventSource(eventStack.queue, { batchSize: 10 }));

    const maintananceBox = new MaintenanceBox(this, 'MaintenanceBox', { vpc });

    const db = new Database(this, 'Database', { vpc, port: 5432, databaseName: 'mpa' });

    const prismaLayers = new PrismaLayers(this, 'PrismaLayers');

    const appConfig = new AppConfig(this, 'AppConfig');

    const server = new Server(this, 'Server', { vpc });
    server.lambda.addEnvironment('AWS_S3_UPLOAD_BUCKET', buckets.upload.bucketName);
    server.lambda.addEnvironment('AWS_SNS_CONTENT_TOPIC', eventStack.topic.topicArn);
    server.lambda.addEnvironment('DATABASE_URL', db.url);
    server.lambda.addLayers(prismaLayers.clientFiles);
    server.lambda.addToRolePolicy(
      new iam.PolicyStatement({
        // arn:aws:appconfig:${Region}:${Account}:application/${ApplicationId}/environment/${EnvironmentId}/configuration/${ConfigurationProfileId}
        resources: ['*'],
        actions: ['appconfig:StartConfigurationSession', 'appconfig:GetLatestConfiguration']
      })
    );
    buckets.upload.grantPut(server.lambda);
    eventStack.topic.grantPublish(server.lambda);

    const migrationRunner = new MigrationRunner(this, 'MigrationRunner', { vpc });
    migrationRunner.lambda.addEnvironment('DATABASE_URL', db.url);
    migrationRunner.lambda.addLayers(prismaLayers.clientFiles, prismaLayers.migration);

    const dbAccessors = [server.lambdaSg, migrationRunner.securityGroup, maintananceBox.securityGroup];
    // const dbAccessors = [server.lambdaSg, migrationRunner.securityGroup];
    dbAccessors.forEach(sg => db.securityGroup.addIngressRule(sg, ec2.Port.tcp(5432)));

    const { distribution } = new WebDistribution(this, 'WebDistribution', { server, buckets });

    new BucketDeployments(this, 'BucketDeployments', { buckets, distribution });

    new CfnOutput(this, `MigrationRunnerLambdaArn`, { value: migrationRunner.lambda.functionArn });
    new CfnOutput(this, 'ContentTopicArn', { value: eventStack.topic.topicArn, description: "SNS topic 'content'" });
  }
}

const app = new App();

new AWSAdapterStack(app, 'AppStack', {
  env: {
    account: '616704609253',
    region: 'us-east-1'
  }
});
