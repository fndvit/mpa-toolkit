import './shims.js';
import Sentry from '@sentry/serverless';
import type { APIGatewayEvent } from 'aws-lambda';
import { manifest } from 'MANIFEST';
import { lambdaRequestTracker } from 'pino-lambda';
import { Server } from 'SERVER';

// TODO: import config


const withRequest = lambdaRequestTracker();

const handler = async (event: APIGatewayEvent) => {
  const server = new Server(manifest);

  server.init({ env: process.env as Record<string, string> });

  const { path, headers, multiValueQueryStringParameters, body, httpMethod, requestContext, isBase64Encoded } = event;
  const encoding = isBase64Encoded ? 'base64' : headers['content-encoding'] || 'utf-8';
  const rawBody = typeof body === 'string' ? Buffer.from(body, encoding as BufferEncoding) : body;
  const rawURL = `https://${requestContext.domainName}${path}${parseQuery(multiValueQueryStringParameters)}`;

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

  return {
    statusCode: 404,
    body: 'Not found.'
  };
};

if (process.env.SENTRY_DSN) {
  Sentry.AWSLambda.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0
  });
}

exports.handler = process.env.SENTRY_DSN ? Sentry.AWSLambda.wrapHandler(handler) : handler;

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

async function _getConfig(app, env, cfg) {
  // TODO: caching
  try {
    const url = `http://localhost:2772/applications/${app}/environments/${env}/configurations/${cfg}`;
    const response = await fetch(url);
    return await response.json();
  } catch (e) {
    console.error(e);
    return {};
  }
}
