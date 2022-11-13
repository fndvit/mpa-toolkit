import { Construct } from 'constructs';
import type { aws_s3 as s3, aws_lambda as lambda } from 'aws-cdk-lib';
import { Fn, aws_cloudfront as cloudfront, aws_cloudfront_origins as cloudfront_origins } from 'aws-cdk-lib';
import { HttpApi, HttpMethod, PayloadFormatVersion } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import type { Server } from './Server';

export interface WebDistributionProps {
  server: Server;
  buckets: {
    static: s3.IBucket;
    upload: s3.IBucket;
  };
}

export class WebDistribution extends Construct {
  distribution: cloudfront.IDistribution;
  httpApi: HttpApi;

  constructor(scope: Construct, id: string, props: WebDistributionProps) {
    super(scope, id);

    const { server, buckets } = props;

    this.httpApi = new HttpApi(this, 'API');
    this.httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [HttpMethod.ANY],
      integration: new HttpLambdaIntegration('LambdaServerIntegration', server.lambdaAlias, {
        payloadFormatVersion: PayloadFormatVersion.VERSION_1_0
      })
    });

    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      defaultRootObject: '',
      defaultBehavior: {
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
        originRequestPolicy: new cloudfront.OriginRequestPolicy(this, 'OriginRequestPolicy', {
          cookieBehavior: cloudfront.OriginRequestCookieBehavior.all(),
          queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all()
        }),
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        origin: new cloudfront_origins.HttpOrigin(Fn.select(1, Fn.split('://', this.httpApi.apiEndpoint)), {
          customHeaders: {
            's3-static-host': buckets.static.bucketDomainName,
            's3-content-host': buckets.upload.bucketDomainName
          },
          protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY
        }),
        edgeLambdas: [
          {
            eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
            functionVersion: server.edgeFn,
            includeBody: true
          }
        ]
      }
    });
  }
}
