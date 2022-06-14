import {
  Fn, RemovalPolicy, Duration, Stack,
  aws_s3 as s3,
  aws_s3_deployment as s3_deployment,
  aws_lambda as lambda,
  aws_lambda_nodejs as lambdanode,
  aws_ec2 as ec2,
  aws_rds as rds,
  aws_sqs as sqs,
  aws_sns as sns,
  aws_lambda_event_sources as lambda_event_sources,
  aws_lambda_nodejs as lambda_nodejs,
  aws_sns_subscriptions as subs,
  aws_cloudfront as cloudfront,
  StackProps,
  App,
  CfnOutput,
} from 'aws-cdk-lib';
import { HttpApi, HttpMethod, PayloadFormatVersion } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Construct } from 'constructs';
import dotenv from 'dotenv';
import path from 'path';

class AWSAdapterStack extends Stack {

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const projectRoot = process.cwd();

    const buildDir = path.join(projectRoot, 'build');
    const staticPath = path.join(buildDir, 'assets');
    const prerenderedPath = path.join(buildDir, 'prerendered');
    const edgePath = path.join(buildDir, 'edge');
    const handlerPath = path.join(buildDir, 'handler');

    const envPath = path.join(projectRoot, './.env.production');

    const dotenvConfig = dotenv.config({ path: envPath });
    if (dotenvConfig.error) throw dotenvConfig.error;
    if (!dotenvConfig.parsed) throw new Error('Failed to load .env file');

    const env = dotenvConfig.parsed;

    const REQUIRED_ENV = ['GOOGLE_OAUTH_CLIENT_ID', 'GOOGLE_OAUTH_CLIENT_SECRET', 'ORIGIN'];
    const missingEnv = REQUIRED_ENV.filter(key => !env[key]);
    if (missingEnv.length > 0) throw new Error(`Missing environment variables: ${missingEnv.join(', ')}`);

    const deadLetterQueue = new sqs.Queue(this, 'DeadLetterQueue', {
      retentionPeriod: Duration.minutes(30)
    });

    const eventProcessorQueue = new sqs.Queue(this, 'EventProcessorQueue', {
      deadLetterQueue: {
        queue: deadLetterQueue,
        maxReceiveCount: 5
      }
    });

    const pageUpdateTopic = new sns.Topic(this, 'PageEventTopic', {
      topicName: 'page',
    });

    pageUpdateTopic.addSubscription(new subs.SqsSubscription(eventProcessorQueue));

    new CfnOutput(this, 'PageUpdateTopicArn', {
      value: pageUpdateTopic.topicArn,
      description: 'The arn of the SNS PageUpdateTopic',
    });

    const bucket = new s3.Bucket(this, 'StaticContentBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: true,
    });

    const contentBucket = new s3.Bucket(this, 'ContentBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: true,
    });

    const vpc = new ec2.Vpc(this, 'VPC', {
      natGateways: 1,
      subnetConfiguration: [
        { cidrMask: 24, name: 'Public', subnetType: ec2.SubnetType.PUBLIC},
        { cidrMask: 24, name: 'Private', subnetType: ec2.SubnetType.PRIVATE_WITH_NAT},
        { cidrMask: 24, name: 'Isolated', subnetType: ec2.SubnetType.PRIVATE_ISOLATED},
      ]
    });

    const lambdaSg = new ec2.SecurityGroup(this, 'LambdaSG', { vpc: vpc });

    const dbSg = new ec2.SecurityGroup(this, 'DB inbound', {
      vpc,
      allowAllOutbound: false,
      description: 'Allow inbound from lambda'
    });

    dbSg.addIngressRule(lambdaSg, ec2.Port.tcp(5432));

    const instanceIdentifier = 'postgres-01';
    const credsSecretName = `/${id}/rds/creds/${instanceIdentifier}`.toLowerCase();
    const dbSecret = new rds.DatabaseSecret(this, 'PostgresRdsCredentials', {
      secretName: credsSecretName,
      username: 'mpa'
    });
    const credentials = rds.Credentials.fromSecret(dbSecret);

    const DB_PORT = 5432;

    const db = new rds.DatabaseInstance(this, 'PostgresDatabase', {
      engine: rds.DatabaseInstanceEngine.POSTGRES,
      databaseName: 'mpa',
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED
      },
      securityGroups: [dbSg],
      port: DB_PORT,
      credentials,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MICRO),
      backupRetention: Duration.days(7),
    });

    const routerLambdaHandler = new cloudfront.experimental.EdgeFunction(this, 'RouterEdgeFunctionHandler', {
      code: new lambda.AssetCode(edgePath),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      memorySize: 128,
      timeout: Duration.seconds(1),
    });

    const databaseUrl = (host: string, port: number, username: string, password: string, database: string) => {
      return `postgresql://${username}:${password}@${host}:${port}/${database}?schema=public`;
    };

    const prismaClientFiles = [
      'index.js', 'package.json', 'schema.prisma',
      'libquery_engine-rhel-openssl-1.0.x.so.node',
    ];

    const fullEnvVars = {
      ...env,
      AWS_S3_CONTENT_BUCKET: contentBucket.bucketName,
      AWS_SNS_PAGE_UPDATE_TOPIC: pageUpdateTopic.topicArn,
      DATABASE_URL: databaseUrl(
        db.instanceEndpoint.hostname, DB_PORT,
        credentials.username, credentials.password!.toString(),
        'mpa'
      ),
    };

    const serverFn = new lambdanode.NodejsFunction(this, 'LambdaServerFunctionHandler', {
      entry: path.join(handlerPath, "index.js"),
      memorySize: 256,
      timeout: Duration.seconds(15),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_NAT
      },
      securityGroups: [lambdaSg],
      depsLockFilePath: path.join(projectRoot, "./yarn.lock"),
      environment: fullEnvVars,
      bundling: {
        inject: ["./adapter/dist/lambda/shims.js"],
        commandHooks: {
          beforeInstall: (i, o) => [],
          beforeBundling: (i, o) => [],
          afterBundling: (i, o) => [
            `mkdir -p ${o}/node_modules/.prisma/client`,
            ...prismaClientFiles.map(f =>
              `cp ${i}/node_modules/.prisma/client/${f} ${o}/node_modules/.prisma/client/`
            ),
          ],
        },
      },
    });

    contentBucket.grantPut(serverFn);
    pageUpdateTopic.grantPublish(serverFn);

    const migrationRunner = new lambdanode.NodejsFunction(this, "MigrationRunner", {
      entry: "./src/lambda/migration-runner.ts",
      memorySize: 256,
      timeout: Duration.seconds(20),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED
      },
      environment: fullEnvVars,
      securityGroups: [lambdaSg],
      depsLockFilePath: path.join(projectRoot, "./yarn.lock"),
      bundling: {
        nodeModules: ["prisma"],
        environment: {
          'PRISMA_CLI_BINARY_TARGETS': 'rhel-openssl-1.0.x'
        },
        commandHooks: {
          beforeInstall: (i, o) => [
            `cp -R ${i}/prisma ${o}`,
            `mkdir -p ${o}/node_modules/.prisma/client`,
            ...prismaClientFiles.map(f =>
              `cp ${i}/node_modules/.prisma/client/${f} ${o}/node_modules/.prisma/client/`
            ),
          ],
          beforeBundling: (i, o) => [],
          afterBundling: (i, o) => [],
        },
      }
    });

    new CfnOutput(this, `MigrationRunnerLambdaArn`, { value: migrationRunner.functionArn });

    const httpApi = new HttpApi(this, 'API');
    httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [HttpMethod.ANY],
      integration: new HttpLambdaIntegration('LambdaServerIntegration', serverFn, {
        payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
      }),
    });

    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'CloudFrontWebDistribution', {
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      enabled: true,
      defaultRootObject: '',
      originConfigs: [
        {
          customOriginSource: {
            domainName: Fn.select(1, Fn.split('://', httpApi.apiEndpoint)),
            originHeaders: {
              's3-static-host': bucket.bucketDomainName,
              's3-content-host': contentBucket.bucketDomainName,
            },
            originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
          },
          behaviors: [
            {
              defaultTtl: Duration.seconds(0),
              isDefaultBehavior: true,
              compress: true,
              allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL,
              forwardedValues: {
                queryString: true,
                cookies: {
                  forward: 'all',
                },
              },
              lambdaFunctionAssociations: [
                {
                  eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
                  lambdaFunction: routerLambdaHandler,
                  includeBody: true,
                },
              ],
            },
          ],
        },
      ],
    });

    new s3_deployment.BucketDeployment(this, 'ImmutableAssetDeployment', {
      destinationBucket: bucket,
      sources: [s3_deployment.Source.asset(path.join(staticPath, '_app'))],
      destinationKeyPrefix: '_app/',
      cacheControl: [s3_deployment.CacheControl.fromString('max-age=31536000, public, immutable')],
      retainOnDelete: false,
      prune: false, // TODO: delayed pruning (for seamless deployments)
      distribution,
    });

    new s3_deployment.BucketDeployment(this, 'StaticContentDeployment', {
      destinationBucket: bucket,
      sources: [
        s3_deployment.Source.asset(staticPath, { exclude: ['_app/*'] }),
        s3_deployment.Source.asset(prerenderedPath)
      ],
      cacheControl: [s3_deployment.CacheControl.fromString('max-age=3600, public')],
      retainOnDelete: true,
      prune: true,
      exclude: ['_app', '_app/', '_app/*'],
      distribution,
    });

    const cachePurgeLambda = new lambda_nodejs.NodejsFunction(this, 'CachePurgeLambda', {
      entry: "./src/lambda/cache-purger.ts",
      memorySize: 256,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'main',
      environment: fullEnvVars,
      securityGroups: [lambdaSg],
      depsLockFilePath: path.join(projectRoot, "./yarn.lock"),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_NAT
      },
    });

    cachePurgeLambda.addEventSource(
      new lambda_event_sources.SqsEventSource(eventProcessorQueue, {
        batchSize: 10,
      }),
    );

    const dlqLambda = new lambda_nodejs.NodejsFunction(this, 'DlqLambda', {
      entry: "./src/lambda/dlq.ts",
      memorySize: 1024,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'main',
      securityGroups: [lambdaSg],
      depsLockFilePath: path.join(projectRoot, "./yarn.lock"),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_NAT
      },
    });

    dlqLambda.addEventSource(new lambda_event_sources.SqsEventSource(deadLetterQueue));
  }
}

const app = new App();

new AWSAdapterStack(app, 'AppStack', {
  env: {
      account: '616704609253',
      region: 'us-east-1',
  }
});
