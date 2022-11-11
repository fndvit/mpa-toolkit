import { Construct } from 'constructs';
import { aws_ec2 as ec2, aws_lambda as lambda, aws_lambda_nodejs as lambda_nodejs, Duration } from 'aws-cdk-lib';
import type { ConfigToEnvClean } from '@mpa/env';
import { getLambdaPath } from '../util/dirs';

export const CACHE_PURGER_ENV_CONFIG = {
  FASTLY_API_KEY: true,
  FASTLY_SERVICE_ID: true,
  LOG_TRANSPORT: true,
  LOG_LEVEL: true
} as const;

export interface CachePurgerProps {
  vpc: ec2.IVpc;
  env: ConfigToEnvClean<typeof CACHE_PURGER_ENV_CONFIG>;
}

export class CachePurger extends Construct {
  lambda: lambda_nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: CachePurgerProps) {
    super(scope, id);

    const { vpc, env } = props;

    this.lambda = new lambda_nodejs.NodejsFunction(this, 'Lambda', {
      entry: getLambdaPath('cache-purger.ts'),
      memorySize: 256,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'main',
      environment: env,
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_NAT
      },
      events: []
    });
  }
}
