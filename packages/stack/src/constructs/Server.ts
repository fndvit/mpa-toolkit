import { Construct } from 'constructs';
import {
  aws_ec2 as ec2,
  aws_lambda as lambda,
  aws_lambda_nodejs as lambdanode,
  aws_cloudfront as cloudfront,
  aws_secretsmanager as secretsmanager,
  Duration
} from 'aws-cdk-lib';
import type { ConfigToEnvClean } from '@mpa/env';
import { getPath } from '../util/dirs';

export const SERVER_ENV_CONFIG = {
  PUBLIC_UPLOAD_BASE_URL: true,
  PUBLIC_GOOGLE_OAUTH_CLIENT_ID: true,
  GOOGLE_OAUTH_CLIENT_SECRET: true,
  DISABLE_CACHE: false,
  LOG_TRANSPORT: true,
  LOG_LEVEL: true
} as const;

export interface ServerProps {
  vpc: ec2.IVpc;
  appConfigLayer?: lambda.ILayerVersion;
  prismaEngineLayer: lambda.ILayerVersion;
  env: ConfigToEnvClean<typeof SERVER_ENV_CONFIG>;
}

export class Server extends Construct {
  lambdaSg: ec2.SecurityGroup;
  lambda: lambdanode.NodejsFunction;
  lambdaAlias: lambda.Alias;
  edgeFn: cloudfront.experimental.EdgeFunction;

  constructor(scope: Construct, id: string, props: ServerProps) {
    super(scope, id);

    const { vpc, env, prismaEngineLayer } = props;

    this.lambdaSg = new ec2.SecurityGroup(this, 'LambdaSG', { vpc });

    const secret = new secretsmanager.Secret(this, 'JWTSecret');

    this.lambda = new lambdanode.NodejsFunction(this, 'Lambda', {
      tracing: lambda.Tracing.ACTIVE,
      entry: getPath('./packages/web/.svelte-kit/server/index.js'),
      memorySize: 256,
      timeout: Duration.seconds(15),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_NAT
      },
      layers: [prismaEngineLayer],
      runtime: lambda.Runtime.NODEJS_16_X,
      securityGroups: [this.lambdaSg],
      environment: {
        ...env,
        JWT_SECRET_KEY: secret.secretValue.toString() // TODO: move to appConfig
      },
      bundling: {
        externalModules: ['@sentry/serverless'],
        inject: ['./packages/stack/dist/lambda/shims.js'],
        commandHooks: {
          beforeInstall: () => [],
          beforeBundling: () => [],
          afterBundling: (i, o) => [`cp ${i}/packages/db/prisma/schema.prisma ${o}`]
        }
      }
    });

    this.lambdaAlias = this.lambda.addAlias('live');

    const as = this.lambdaAlias.addAutoScaling({
      minCapacity: 2,
      maxCapacity: 50
    });

    as.scaleOnUtilization({
      utilizationTarget: 0.5
    });

    this.edgeFn = new cloudfront.experimental.EdgeFunction(this, 'EdgeRouter', {
      code: new lambda.AssetCode(getPath('./packages/web/.svelte-kit/router')),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      memorySize: 128,
      timeout: Duration.seconds(1)
    });
  }
}
