import { Construct } from 'constructs';
import {
  aws_ec2 as ec2,
  aws_lambda as lambda,
  aws_lambda_nodejs as lambdanode,
  aws_cloudfront as cloudfront,
  Duration
} from 'aws-cdk-lib';
import { getPath } from '../util/dirs';
import { getBaseEnvVars } from '../util/env';

export interface ServerProps {
  vpc: ec2.IVpc;
}

export class Server extends Construct {
  lambdaSg: ec2.SecurityGroup;
  lambda: lambdanode.NodejsFunction;
  edgeFn: cloudfront.experimental.EdgeFunction;

  constructor(scope: Construct, id: string, props: ServerProps) {
    super(scope, id);

    const { vpc } = props;

    this.lambdaSg = new ec2.SecurityGroup(this, 'LambdaSG', { vpc });

    const prismaClientFiles = [
      'index.js',
      'package.json',
      'schema.prisma',
      'libquery_engine-rhel-openssl-1.0.x.so.node'
    ];

    this.lambda = new lambdanode.NodejsFunction(this, 'Lambda', {
      entry: getPath('build/handler/index.js'),
      memorySize: 256,
      timeout: Duration.seconds(15),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_NAT
      },
      layers: [
        lambda.LayerVersion.fromLayerVersionArn(
          this,
          'LambdaAppConfigLayer',
          'arn:aws:lambda:us-east-1:027255383542:layer:AWS-AppConfig-Extension:69'
        )
      ],
      runtime: lambda.Runtime.NODEJS_16_X,
      securityGroups: [this.lambdaSg],
      depsLockFilePath: getPath('yarn.lock'),
      environment: getBaseEnvVars('.env.production')
    });

    this.edgeFn = new cloudfront.experimental.EdgeFunction(this, 'EdgeRouter', {
      code: new lambda.AssetCode(getPath('build/edge')),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      memorySize: 128,
      timeout: Duration.seconds(1)
    });
  }
}
