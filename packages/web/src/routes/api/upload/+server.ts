import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { uploadAsset } from '$lib/s3';
import { apiEndpoint } from '$lib/helpers/endpoints';

export const PUT = apiEndpoint<RequestHandler>(async ({ request }) => {
  const formData = await request.formData();
  const asset = formData.get('asset') as File;
  const assetPath = await uploadAsset(asset);
  return json({ path: assetPath });
});
