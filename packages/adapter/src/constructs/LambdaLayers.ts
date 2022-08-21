import { Construct } from 'constructs';
import { aws_lambda as lambda } from 'aws-cdk-lib';

interface LambdaLayersProps {
  sentryArn?: string;
  appConfigArn?: string;
}

export class LambdaLayers extends Construct {
  sentry?: lambda.ILayerVersion;
  appConfig?: lambda.ILayerVersion;

  constructor(scope: Construct, id: string, props: LambdaLayersProps) {
    super(scope, id);

    if (props.sentryArn) this.sentry = lambda.LayerVersion.fromLayerVersionArn(this, 'Sentry', props.sentryArn);

    if (props.appConfigArn)
      this.appConfig = lambda.LayerVersion.fromLayerVersionArn(this, 'AppConfig', props.appConfigArn);
  }
}
