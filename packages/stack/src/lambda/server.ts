/// <reference path = "../injected.d.ts" />
import './shims.js';
import type { APIGatewayEvent } from 'aws-lambda';
import { manifest } from 'MANIFEST';
import { Server } from 'SERVER';
import AWSSDK from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk-core';

AWSXRay.captureAWS(AWSSDK);

export async function handler(event: APIGatewayEvent) {
  const segment = AWSXRay.getSegment();
  const lambdaSegment = segment?.addNewSubsegment('lambda.handler');

  const server = new Server(manifest);

  server.init({ env: process.env as Record<string, string> });

  const { path, headers, multiValueQueryStringParameters, body, httpMethod, requestContext, isBase64Encoded } = event;

  lambdaSegment?.addMetadata('event', event);

  const encoding = isBase64Encoded ? 'base64' : headers['content-encoding'] || 'utf-8';
  const rawBody = typeof body === 'string' ? Buffer.from(body, encoding as BufferEncoding) : body;
  const rawURL = `https://${requestContext.domainName}${path}${parseQuery(multiValueQueryStringParameters)}`;

  const respondSegment = lambdaSegment?.addNewSubsegment('server.respond');

  const rendered = await server.respond(
    new Request(rawURL, {
      method: httpMethod,
      headers: headers as Record<string, string>,
      body: rawBody
    }),
    {
      getClientAddress: () => requestContext.identity.sourceIp
    }
  );

  respondSegment?.close();

  if (rendered) {
    const resp = {
      headers: {},
      multiValueHeaders: {},
      body: await rendered.text(),
      statusCode: rendered.status
    };

    for (const k of rendered.headers.keys()) {
      const v = rendered.headers.get(k);
      resp.headers[k] = v;
    }
    return resp;
  }

  lambdaSegment?.close();

  return {
    statusCode: 404,
    body: 'Not found.'
  };
}

function parseQuery(queryParams) {
  if (!queryParams) return '';
  let queryString = '?';

  for (const queryParamKey in queryParams) {
    for (const queryParamValue of queryParams[queryParamKey]) {
      if (queryString != '?') {
        queryString += '&';
      }
      queryString += `${queryParamKey}=${queryParamValue}`;
    }
  }
  return queryString;
}
