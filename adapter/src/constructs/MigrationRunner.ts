import { Construct } from 'constructs';
import { aws_ec2 as ec2, aws_lambda_nodejs as lambdanode, Duration, aws_lambda as lambda } from 'aws-cdk-lib';
import { getBaseEnvVars } from '../util/env';
import { getPath } from '../util/dirs';

export interface MigrationRunnerProps {
  vpc: ec2.IVpc;
}

export class MigrationRunner extends Construct {
  securityGroup: ec2.SecurityGroup;
  lambda: lambdanode.NodejsFunction;

  constructor(scope: Construct, id: string, props: MigrationRunnerProps) {
    super(scope, id);

    const { vpc } = props;

    this.securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', { vpc });

    this.lambda = new lambdanode.NodejsFunction(this, 'Lambda', {
      entry: './src/lambda/migration-runner.ts',
      memorySize: 256,
      timeout: Duration.seconds(20),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED
      },
      runtime: lambda.Runtime.NODEJS_16_X,
      environment: getBaseEnvVars('.env.production'),
      securityGroups: [this.securityGroup],
      depsLockFilePath: getPath('yarn.lock'),
      bundling: {
        nodeModules: ['prisma'],
        environment: {
          PRISMA_CLI_BINARY_TARGETS: 'rhel-openssl-1.0.x'
        }
      }
    });
  }
}
