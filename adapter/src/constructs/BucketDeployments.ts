import { Construct } from 'constructs';
import { aws_cloudfront as cloudfront, aws_s3 as s3, aws_s3_deployment as s3_deployment } from 'aws-cdk-lib';
import { getPath } from '../util/dirs';

export interface BucketDeploymentsProps {
  buckets: {
    static: s3.Bucket;
  };
  distribution: cloudfront.CloudFrontWebDistribution;
}

export class BucketDeployments extends Construct {
  constructor(scope: Construct, id: string, props: BucketDeploymentsProps) {
    super(scope, id);

    const { buckets, distribution } = props;

    new s3_deployment.BucketDeployment(this, 'Immutable', {
      destinationBucket: buckets.static,
      sources: [s3_deployment.Source.asset(getPath('build/assets/_app'))],
      destinationKeyPrefix: '_app/',
      cacheControl: [s3_deployment.CacheControl.fromString('max-age=31536000, public, immutable')],
      retainOnDelete: false,
      prune: false, // TODO: delayed pruning (for seamless deployments)
      distribution
    });

    new s3_deployment.BucketDeployment(this, 'Static', {
      destinationBucket: buckets.static,
      sources: [
        s3_deployment.Source.asset(getPath('build/assets'), { exclude: ['_app/*'] }),
        s3_deployment.Source.asset(getPath('build/prerendered'))
      ],
      cacheControl: [s3_deployment.CacheControl.fromString('max-age=3600, public')],
      retainOnDelete: true,
      prune: true,
      exclude: ['_app', '_app/', '_app/*'],
      distribution
    });
  }
}
