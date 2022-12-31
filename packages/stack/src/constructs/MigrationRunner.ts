import { Construct } from 'constructs';
import type { aws_lambda_nodejs as lambdanode } from 'aws-cdk-lib';
import { aws_ec2 as ec2, Duration, aws_lambda as lambda } from 'aws-cdk-lib';
import { getEnv } from '@mpa/env/env';
import { getPath } from '../util/dirs';

export const MIGRATION_RUNNER_ENV_CONFIG = {
  LOG_TRANSPORT: true,
  LOG_LEVEL: true
} as const;

export interface MigrationRunnerProps {
  vpc: ec2.IVpc;
  env: Record<string, string>;
}

export class MigrationRunner extends Construct {
  securityGroup: ec2.SecurityGroup;
  lambda: lambdanode.NodejsFunction;

  constructor(scope: Construct, id: string, props: MigrationRunnerProps) {
    super(scope, id);

    const { vpc, env } = props;

    this.securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', { vpc });

    this.lambda = new lambda.Function(this, 'Lambda', {
      tracing: lambda.Tracing.ACTIVE,
      memorySize: 256,
      architecture: lambda.Architecture.X86_64,
      timeout: Duration.seconds(60),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED
      },
      runtime: lambda.Runtime.NODEJS_16_X,
      environment: {
        ...env,
        ...getEnv(MIGRATION_RUNNER_ENV_CONFIG)
      },
      securityGroups: [this.securityGroup],
      code: lambda.Code.fromAsset(getPath('packages/migration-runner/dist')),
      handler: 'index.handler'
    });
  }
}
