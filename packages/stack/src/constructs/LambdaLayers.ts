import { Construct } from 'constructs';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { getPath } from 'src/util/dirs';

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

    if (props.sentryArn) this.sentry = lambda.LayerVersion.fromLayerVersionArn(this, 'Sentry', props.sentryArn);

    if (props.appConfigArn)
      this.appConfig = lambda.LayerVersion.fromLayerVersionArn(this, 'AppConfig', props.appConfigArn);

    this.prismaEngine = new lambda.LayerVersion(this, 'PrismaEngine', {
      compatibleRuntimes: [lambda.Runtime.NODEJS_14_X, lambda.Runtime.NODEJS_16_X],
      code: lambda.Code.fromAsset(getPath('./packages/web/.svelte-kit/prisma-engine'))
    });
  }
}
