import { Construct } from 'constructs';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import projectRoot from '@mpa/utils/projectRoot';

export class LambdaLayers extends Construct {
  sentry?: lambda.ILayerVersion;
  appConfig?: lambda.ILayerVersion;
  prismaEngineQuery: lambda.ILayerVersion;
  prismaEngineOther: lambda.ILayerVersion;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.prismaEngineQuery = new lambda.LayerVersion(this, 'PrismaEngine-Query', {
      compatibleRuntimes: [lambda.Runtime.NODEJS_16_X],
      code: lambda.Code.fromAsset(projectRoot('packages/web/build/prisma-engine/query'))
    });

    this.prismaEngineOther = new lambda.LayerVersion(this, 'PrismaEngine-Layers', {
      compatibleRuntimes: [lambda.Runtime.NODEJS_16_X],
      code: lambda.Code.fromAsset(projectRoot('packages/web/build/prisma-engine/other'))
    });
  }
}
