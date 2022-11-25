import { json } from '@sveltejs/kit';
import getMedata from 'metadata-scraper';
import sharp from 'sharp';
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
  const cropData = JSON.parse(urlParams.get('cropData') as string) as Cropper.Data;

  const metadata = await getMedata(metaURL);
  const imgResponse = await fetch(metadata.image, { method: 'GET', headers: { accept: 'application/json' } });


  const resBuffer = Buffer.from(await imgResponse.arrayBuffer());
  const cropped = await sharp(resBuffer).resize(cropData.width, cropData.height, { fit: "cover" }).toFormat('png').toBuffer();
  const croppedFile = blobToFile(new Blob([cropped]), `${encodeURI(metadata?.title)}-cropped.png`);

  const path = await uploadImage(croppedFile as File);

  return json({
    image: path,
    title: metadata.title
  });

};