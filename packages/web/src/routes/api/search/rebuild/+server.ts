import { db } from '$lib/db';
import { apiEndpoint } from '$lib/helpers/endpoints';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST = apiEndpoint<RequestHandler>(async () => {
  const count = await db.page.rebuildSearchIndex();
  return json({ status: 'ok', count });
});
