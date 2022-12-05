import { Construct } from 'constructs';
import type { aws_s3 as s3 } from 'aws-cdk-lib';
import { aws_s3_deployment as s3_deployment } from 'aws-cdk-lib';
import projectRoot from '@mpa/utils/projectRoot';

export interface BucketDeploymentsProps {
  bucket: s3.IBucket;
}

export class BucketDeployments extends Construct {
  constructor(scope: Construct, id: string, props: BucketDeploymentsProps) {
    super(scope, id);

    const { bucket } = props;

    const assetsDir = projectRoot('packages/web/build/client');

    new s3_deployment.BucketDeployment(this, 'Immutable', {
      destinationBucket: bucket,
      sources: [s3_deployment.Source.asset(`${assetsDir}/_app`)],
      destinationKeyPrefix: '_app/',
      cacheControl: [s3_deployment.CacheControl.fromString('max-age=31536000, public, immutable')],
      retainOnDelete: true,
      prune: false // TODO: delayed pruning ?
    });

    new s3_deployment.BucketDeployment(this, 'Static', {
      destinationBucket: bucket,
      sources: [s3_deployment.Source.asset(assetsDir, { exclude: ['_app/*'] })],
      cacheControl: [s3_deployment.CacheControl.fromString('max-age=3600, public')],
      retainOnDelete: true,
      prune: true,
      exclude: ['_app', '_app/', '_app/*']
    });
  }
}
