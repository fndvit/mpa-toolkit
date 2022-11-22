import type { APIGatewayProxyResultV2, SQSEvent } from 'aws-lambda';
import AWSSDK from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk-core';

AWSXRay.captureAWS(AWSSDK);

export async function main(event: SQSEvent): Promise<APIGatewayProxyResultV2> {
  const messages = event.Records.map(record => {
    const body = JSON.parse(record.body) as { Message: string };
    console.log('mesage body 👉', JSON.stringify(body, null, 2));

    return { message: body.Message };
  });

  console.log('messages 👉', JSON.stringify(messages, null, 2));

  return {
    body: JSON.stringify({ messages }),
    statusCode: 200
  };
}
