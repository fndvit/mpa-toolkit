import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { uploadImage } from '$lib/s3';
import { apiEndpoint } from '$lib/helpers/endpoints';

export const PUT = apiEndpoint<RequestHandler>(async ({ request }) => {
  const formData = await request.formData();
  const image = formData.get('asset') as File;
  const imgPath = await uploadImage(image);
  return json({ path: imgPath });
});
