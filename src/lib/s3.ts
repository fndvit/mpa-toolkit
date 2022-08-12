import { PutObjectCommandInput, S3 } from '@aws-sdk/client-s3';
import { logger } from './log';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import env from './env';

const log = logger.child({ module: 's3' });

const s3 = new S3({});

export async function uploadImage(file: File, filename?: string): Promise<string> {
  const _filename = filename || uuidv4();
  const key = `img/${_filename}.${mime.extension(file.type)}`;
  const params: PutObjectCommandInput = {
    Bucket: env.AWS_S3_UPLOAD_BUCKET,
    Key: key,
    Body: Buffer.from(await file.arrayBuffer()),
    CacheControl: 'max-age=31536000',
    ContentType: file.type
  };
  const filesize = Math.round(file.size / 1000).toLocaleString();
  log.info(`Uploading file to s3: ${env.AWS_S3_UPLOAD_BUCKET} ${key} (${filesize} KB)`);
  await s3.putObject(params);
  log.info('Uploaded successfully');
  return key;
}
