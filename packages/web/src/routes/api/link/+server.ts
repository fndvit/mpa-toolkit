import { error, json } from '@sveltejs/kit';
import sharp from 'sharp';
import type { RequestHandler } from './$types';
import { uploadImage } from '$lib/s3';
import getMetaData from 'metadata-scraper';

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

  const { title, image } = await getMetaData(url);

  return json({
    image: image ? await fetchAndUploadMetadataImage(image) : null,
    title
  });
};
