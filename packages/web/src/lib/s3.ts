import crypto from 'crypto';
import { S3 } from '@aws-sdk/client-s3';
import { logger } from '@mpa/log';
import mime from 'mime-types';
import AWSXRay from 'aws-xray-sdk-core';
import { env } from '$lib/env';
import sharp from 'sharp';
import pretty from 'pretty-bytes';

const log = logger('S3');

const region = env.AWS_REGION ?? 'eu-west-1';

if (!env.AWS_REGION) {
  log.warn(`AWS_REGION is not set. Defaulting to ${region}`);
}

const s3 = new S3({ region });

AWSXRay.captureAWSv3Client(s3);

const bufToHash = async (buf: Buffer): Promise<string> => {
  const hash = crypto.createHash('sha256');
  hash.update(Date.now().toString());
  hash.update(buf);
  return hash.digest('hex').slice(0, 16);
};

interface UploadFileOpts {
  body: Buffer;
  type: string;
  name?: string;
  dir: string;
}

async function uploadFile({ body, type, name, dir }: UploadFileOpts): Promise<string> {
  const ext = mime.extension(type);
  const _name = name || (await bufToHash(body));
  const key = `${dir}/${_name}.${ext}`;
  log.info(`Uploading file to s3: ${env.AWS_S3_UPLOAD_BUCKET} ${key} (${pretty(body.byteLength)} KB)`);
  await s3.putObject({
    Bucket: env.AWS_S3_UPLOAD_BUCKET,
    Key: `upload/${key}`,
    Body: body,
    CacheControl: 'max-age=31536000',
    ContentType: type
  });
  return key;
}

export async function uploadImage(blob: Blob): Promise<string>;
export async function uploadImage(buffer: Buffer): Promise<string>;
export async function uploadImage(blobOrBuf: Blob | Buffer): Promise<string> {
  const buf = Buffer.isBuffer(blobOrBuf) ? blobOrBuf : Buffer.from(await blobOrBuf.arrayBuffer());
  const metadata = await sharp(buf).metadata();
  const acceptedTypes = {
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    avif: 'image/avif'
  };
  if (!metadata?.format || !acceptedTypes[metadata.format]) {
    throw new Error('Invalid image');
  }
  return uploadFile({ body: buf, type: acceptedTypes[metadata.format], dir: 'images' });
}

export const uploadAsset = async (blob: Blob): Promise<string> =>
  uploadFile({ body: Buffer.from(await blob.arrayBuffer()), type: blob.type, dir: 'assets' });
