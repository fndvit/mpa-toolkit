import { error, json } from '@sveltejs/kit';
import sharp from 'sharp';
import type { RequestHandler } from './$types';
import { uploadImage } from '$lib/s3';
import getMetaData from 'metadata-scraper';
import { RequestError } from 'got';

const fetchAndUploadMetadataImage = async (url: string) => {
  const imgResponse = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'image/*'
    }
  });

  const imgBuf = await sharp(Buffer.from(await imgResponse.arrayBuffer()))
    .resize({
      width: 400,
      withoutEnlargement: true
    })
    .jpeg({ quality: 95 })
    .toBuffer();

  return uploadImage(imgBuf);
};

export const POST: RequestHandler = async ({ request }) => {
  const { url } = await request.json();
  if (!url) throw error(400, 'Missing url');

  try {
    const { title, image } = await getMetaData(url);
    return json({
      image: image ? await fetchAndUploadMetadataImage(image) : null,
      title
    });
  } catch (err) {
    if (err instanceof RequestError) {
      if (err.code === 'ETIMEDOUT') throw error(504, 'Request timed out');
      if (err.code === 'ENOTFOUND') throw error(404, 'Not found');
      if (err.code === 'ECONNREFUSED') throw error(502, 'Connection refused');
    }
    throw error(500, 'Failed to get metadata');
  }
};
