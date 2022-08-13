import { Construct } from 'constructs';
import { aws_ec2 as ec2, aws_lambda as lambda, aws_lambda_nodejs as lambda_nodejs, Duration } from 'aws-cdk-lib';
import { getBaseEnvVars } from '../util/env';
import { getPath } from '../util/dirs';

export interface CachePurgerProps {
  vpc: ec2.IVpc;
}

export class CachePurger extends Construct {
  lambda: lambda_nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: CachePurgerProps) {
    super(scope, id);

    const { vpc } = props;

    this.lambda = new lambda_nodejs.NodejsFunction(this, 'Lambda', {
      entry: './src/lambda/cache-purger.ts',
      memorySize: 256,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'main',
      environment: getBaseEnvVars('.env.production', ['FASTLY_SERVICE_ID', 'FASTLY_API_KEY']),
      // securityGroups: [lambdaSg],
      depsLockFilePath: getPath('yarn.lock'),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_NAT
      },
      events: []
    });
  }
}
