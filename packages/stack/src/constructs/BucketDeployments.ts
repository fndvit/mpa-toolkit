import { Construct } from 'constructs';
import type { aws_s3 as s3 } from 'aws-cdk-lib';
import { aws_s3_deployment as s3_deployment } from 'aws-cdk-lib';
import projectRoot from '@mpa/utils/projectRoot';
import type { MpathStackProps } from 'src/stack';

export interface BucketDeploymentsProps {
  assetBucket: s3.IBucket;
  stage: MpathStackProps['stage'];
}

export class BucketDeployments extends Construct {
  constructor(scope: Construct, id: string, props: BucketDeploymentsProps) {
    super(scope, id);

    const { assetBucket, stage } = props;

    const assetsDir = projectRoot('packages/web/build/client');

    new s3_deployment.BucketDeployment(this, 'Immutable', {
      destinationBucket: assetBucket,
      sources: [s3_deployment.Source.asset(`${assetsDir}/_app`)],
      destinationKeyPrefix: `_app/`,
      cacheControl: [s3_deployment.CacheControl.fromString('max-age=31536000, public, immutable')],
      retainOnDelete: true,
      prune: false
    });

    new s3_deployment.BucketDeployment(this, 'Static', {
      destinationBucket: assetBucket,
      destinationKeyPrefix: `${stage}/`,
      sources: [s3_deployment.Source.asset(assetsDir, { exclude: ['_app/*'] })],
      cacheControl: [s3_deployment.CacheControl.fromString('max-age=3600, public')],
      retainOnDelete: true,
      prune: false
    });
  }
}
