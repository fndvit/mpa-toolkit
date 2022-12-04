import {
  Fn,
  RemovalPolicy,
  aws_s3 as s3,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
  aws_lambda as lambda,
  Duration,
  CfnOutput,
  aws_logs as logs
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { createHash } from 'crypto';

interface ImageOptimizerProps {
  readonly imageBucket: s3.IBucket;
}

export class ImageOptimizer extends Construct {
  constructor(scope: Construct, id: string, props: ImageOptimizerProps) {
    super(scope, id);

    const { imageBucket } = props;

    const SECRET_KEY = createHash('md5').update(this.node.addr).digest('hex');

    const originalImageBucket = imageBucket;
    new CfnOutput(this, 'OriginalImagesS3Bucket', {
      description: 'S3 bucket where original images are stored',
      value: originalImageBucket.bucketName
    });

    const transformedImageBucket = new s3.Bucket(this, 's3-transformed-image-bucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      lifecycleRules: [{ expiration: Duration.days(90) }]
    });

    const imageProcessingLambda = new lambda.Function(this, 'image-optimization', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('dist/image-optimizer-lambda'),
      timeout: Duration.seconds(60),
      memorySize: 1500,
      environment: {
        originalImageBucketName: originalImageBucket.bucketName,
        transformedImageCacheTTL: 'max-age=31622400',
        secretKey: SECRET_KEY,
        logTiming: 'false',
        transformedImageBucketName: transformedImageBucket.bucketName
      },
      logRetention: logs.RetentionDays.ONE_DAY
    });

    const imageProcessingURL = imageProcessingLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE
    });

    const imageOrigin = new origins.OriginGroup({
      primaryOrigin: new origins.S3Origin(transformedImageBucket),
      fallbackOrigin: new origins.HttpOrigin(Fn.select(2, Fn.split('/', imageProcessingURL.url))),
      fallbackStatusCodes: [403]
    });

    transformedImageBucket.grantRead(imageProcessingLambda);
    transformedImageBucket.grantPut(imageProcessingLambda);

    const urlRewriteFunction = new cloudfront.Function(this, 'urlRewrite', {
      code: cloudfront.FunctionCode.fromFile({ filePath: 'src/image-optimizer/functions/url-rewrite/index.js' }),
      functionName: `urlRewriteFunction${this.node.addr}`
    });

    const imageDelivery = new cloudfront.Distribution(this, 'imageDeliveryDistribution', {
      comment: 'image optimization - image delivery',
      defaultBehavior: {
        origin: imageOrigin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: new cloudfront.CachePolicy(this, `ImageCachePolicy${this.node.addr}`, {
          defaultTtl: Duration.hours(24),
          maxTtl: Duration.days(365),
          minTtl: Duration.seconds(0),
          queryStringBehavior: cloudfront.CacheQueryStringBehavior.all()
        }),
        functionAssociations: [
          {
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
            function: urlRewriteFunction
          }
        ],
        responseHeadersPolicy: new cloudfront.ResponseHeadersPolicy(this, `ResponseHeadersPolicy${this.node.addr}`, {
          responseHeadersPolicyName: 'ImageResponsePolicy',
          corsBehavior: {
            accessControlAllowCredentials: false,
            accessControlAllowHeaders: ['*'],
            accessControlAllowMethods: ['GET'],
            accessControlAllowOrigins: ['*'],
            accessControlMaxAge: Duration.seconds(600),
            originOverride: false
          },
          // recognizing image requests that were processed by this solution
          customHeadersBehavior: {
            customHeaders: [{ header: 'x-aws-image-optimization', value: 'v1.0', override: true }]
          }
        })
      }
    });

    new CfnOutput(this, 'ImageDeliveryDomain', {
      description: 'Domain name of image delivery',
      value: imageDelivery.distributionDomainName
    });
  }
}
