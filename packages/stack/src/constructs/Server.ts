import type { aws_s3 as s3, aws_lambda_nodejs as lambdanode } from 'aws-cdk-lib';
import {
  aws_s3_deployment as s3_deployment,
  aws_ec2 as ec2,
  aws_lambda as lambda,
  aws_cloudfront as cloudfront,
  aws_secretsmanager as secretsmanager,
  Duration
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { getEnv } from '@mpa/env';
import type { MpathStackProps } from 'src/stack';
import projectRoot from '@mpa/utils/projectRoot';

export const SERVER_ENV_CONFIG = {
  PUBLIC_UPLOAD_BASE_URL: true,
  PUBLIC_GOOGLE_OAUTH_CLIENT_ID: true,
  GOOGLE_OAUTH_CLIENT_SECRET: true,
  DISABLE_CACHE: false,
  LOG_TRANSPORT: true,
  LOG_LEVEL: true,
  PUBLIC_DB_RESTORE: false
} as const;

export interface ServerProps {
  vpc: ec2.IVpc;
  appConfigLayer?: lambda.ILayerVersion;
  env: Record<string, string>;
  assetBucket: s3.IBucket;
  stage: MpathStackProps['stage'];
}

type LambdaReferences = {
  fn: lambdanode.NodejsFunction;
  alias: lambda.Alias;
};

export class Server extends Construct {
  lambdaSg: ec2.SecurityGroup;
  lambdas: {
    api: LambdaReferences;
    cms: LambdaReferences;
    rest: LambdaReferences;
  };
  edgeFn: cloudfront.experimental.EdgeFunction;

  constructor(scope: Construct, id: string, props: ServerProps) {
    super(scope, id);

    const { vpc, env, stage, assetBucket } = props;

    const ENABLE_SOURCE_MAPS = stage === 'staging';

    this.lambdaSg = new ec2.SecurityGroup(this, 'LambdaSG', { vpc });

    const secret = new secretsmanager.Secret(this, 'JWTSecret');

    const createNewServerFunction = (name: string) => {
      const fn = new lambda.Function(this, `Lambda-${name}`, {
        code: lambda.Code.fromAsset(projectRoot(`packages/web/build/lambda/${name}`), {
          exclude: ENABLE_SOURCE_MAPS ? [] : ['*.map']
        }),
        handler: 'index.handler',
        tracing: lambda.Tracing.ACTIVE,
        memorySize: 1024,
        timeout: Duration.seconds(15),
        vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
        },

        runtime: lambda.Runtime.NODEJS_16_X,
        securityGroups: [this.lambdaSg],
        environment: {
          ...env,
          ...getEnv(SERVER_ENV_CONFIG),
          JWT_SECRET_KEY: secret.secretValue.toString(), // TODO: move to appConfig,
          ...(ENABLE_SOURCE_MAPS ? { NODE_OPTIONS: '--enable-source-maps' } : {})
        }
      });

      const alias = new lambda.Alias(this, `LambdaAlias-${name}`, {
        aliasName: `${stage}-${name}`,
        version: fn.currentVersion,
        provisionedConcurrentExecutions: 1
      });

      return { fn, alias };
    };

    this.lambdas = {
      api: createNewServerFunction('api'),
      cms: createNewServerFunction('cms'),
      rest: createNewServerFunction('rest')
    };

    new s3_deployment.BucketDeployment(this, 'SourceMaps', {
      destinationBucket: assetBucket,
      sources: [
        s3_deployment.Source.asset(projectRoot('packages/web/build/lambda'), {
          exclude: ['**/*.js', '**/node_modules', '**/*.prisma']
        })
      ],
      destinationKeyPrefix: 'sourcemaps/',
      cacheControl: [s3_deployment.CacheControl.fromString('max-age=31536000, public, immutable')],
      retainOnDelete: false,
      prune: false
    });

    this.edgeFn = new cloudfront.experimental.EdgeFunction(this, 'EdgeRouter', {
      code: new lambda.AssetCode(projectRoot('packages/web/build/router')),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      memorySize: 128,
      timeout: Duration.seconds(1)
    });
  }
}
