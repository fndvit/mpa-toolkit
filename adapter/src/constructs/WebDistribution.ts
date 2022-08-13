import { Construct } from 'constructs';
import { Fn, Duration, aws_s3 as s3, aws_lambda as lambda, aws_cloudfront as cloudfront } from 'aws-cdk-lib';
import { HttpApi, HttpMethod, PayloadFormatVersion } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

export interface WebDistributionProps {
  server: {
    edgeFn: lambda.IVersion;
    lambda: lambda.IFunction;
  };
  buckets: {
    static: s3.IBucket;
    upload: s3.IBucket;
  };
}

export class WebDistribution extends Construct {
  distribution: cloudfront.CloudFrontWebDistribution;
  httpApi: HttpApi;

  constructor(scope: Construct, id: string, props: WebDistributionProps) {
    super(scope, id);

    const { server, buckets } = props;

    this.httpApi = new HttpApi(this, 'API');
    this.httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [HttpMethod.ANY],
      integration: new HttpLambdaIntegration('LambdaServerIntegration', server.lambda, {
        payloadFormatVersion: PayloadFormatVersion.VERSION_1_0
      })
    });

    this.distribution = new cloudfront.CloudFrontWebDistribution(this, 'CloudFrontWebDistribution', {
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      enabled: true,
      defaultRootObject: '',
      originConfigs: [
        {
          customOriginSource: {
            domainName: Fn.select(1, Fn.split('://', this.httpApi.apiEndpoint)),
            originHeaders: {
              's3-static-host': buckets.static.bucketDomainName,
              's3-content-host': buckets.upload.bucketDomainName
            },
            originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY
          },
          behaviors: [
            {
              defaultTtl: Duration.seconds(0),
              isDefaultBehavior: true,
              compress: true,
              allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL,
              forwardedValues: {
                queryString: true,
                cookies: {
                  forward: 'all'
                }
              },
              lambdaFunctionAssociations: [
                {
                  eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
                  lambdaFunction: server.edgeFn,
                  includeBody: true
                }
              ]
            }
          ]
        }
      ]
    });
  }
}
