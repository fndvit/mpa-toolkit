import { Construct } from 'constructs';
import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import type { Server } from './Server';
import mapValues from 'lodash/mapValues.js';

export interface WebDistributionProps {
  server: Server;
}

export class HttpApi extends Construct {
  httpApi: apigatewayv2.HttpApi;

  constructor(scope: Construct, id: string, props: WebDistributionProps) {
    super(scope, id);

    const { server } = props;

    this.httpApi = new apigatewayv2.HttpApi(this, 'HttpApi');

    const integrations = mapValues(
      server.lambdas,
      ({ alias }) =>
        new HttpLambdaIntegration(`LambdaIntegration-${alias.aliasName}`, alias, {
          payloadFormatVersion: apigatewayv2.PayloadFormatVersion.VERSION_1_0
        })
    );

    this.httpApi.addRoutes({
      path: '/cms',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: integrations.cms
    });
    this.httpApi.addRoutes({
      path: '/cms/{proxy+}',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: integrations.cms
    });
    this.httpApi.addRoutes({
      path: '/api',
      methods: [apigatewayv2.HttpMethod.ANY],
      integration: integrations.api
    });
    this.httpApi.addRoutes({
      path: '/api/{proxy+}',
      methods: [apigatewayv2.HttpMethod.ANY],
      integration: integrations.api
    });
    this.httpApi.addRoutes({
      path: '/globe.svg',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: integrations.api
    });

    this.httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [apigatewayv2.HttpMethod.ANY],
      integration: integrations.rest
    });
  }
}
