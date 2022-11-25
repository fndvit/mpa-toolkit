import { Construct } from 'constructs';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { getPath } from '../util/dirs';

interface LambdaLayersProps {
  sentryArn?: string;
  appConfigArn?: string;
}

export class LambdaLayers extends Construct {
  sentry?: lambda.ILayerVersion;
  appConfig?: lambda.ILayerVersion;
  prismaEngine: lambda.ILayerVersion;

  constructor(scope: Construct, id: string, props: LambdaLayersProps) {
    super(scope, id);

    this.prismaEngine = new lambda.LayerVersion(this, 'PrismaEngine', {
      compatibleRuntimes: [lambda.Runtime.NODEJS_16_X],
      code: lambda.Code.fromAsset(getPath('./packages/web/.svelte-kit/prisma-engine'))
    });
  }
}
