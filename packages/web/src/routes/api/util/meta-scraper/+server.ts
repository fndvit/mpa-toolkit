import { json } from '@sveltejs/kit';
import getMedata from 'metadata-scraper';
import sharp from 'sharp';
import sizeOf from 'buffer-image-size';
import type { RequestHandler } from './$types';
import { uploadImage } from '$lib/s3';


const blobToFile = (theBlob: Blob, fileName:string) => {
  const b: any= theBlob as File;

  b.last = new Date();
  b.name = fileName;

  return theBlob as File;
};

export const GET: RequestHandler = async ({ request }) => {
  const urlParams = new URLSearchParams(request?.url?.split('?').slice(1).join('?'));
  const metaURL = urlParams.get('url') as string;

  const metadata = await getMedata(metaURL);
  const imgResponse = await fetch(metadata.image, { method: 'GET', headers: { accept: 'application/json' } });

  let imgBuffer = Buffer.from(await imgResponse.arrayBuffer());

  const imgSize = sizeOf(imgBuffer);

  if(imgSize.width > 400){
    imgBuffer = await sharp(imgBuffer).resize(400, (400 / imgSize.width) * imgSize.height).toBuffer();
  }
  imgBuffer = await sharp(imgBuffer).jpeg({ quality: 95 }).toBuffer();

  const croppedFile = blobToFile(new Blob([imgBuffer]), `${encodeURI(metadata?.title)}-cropped.png`);
  const path = await uploadImage(croppedFile as File);

  return json({
    image: path,
    title: metadata.title
  });

};