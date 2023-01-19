import { db } from '$lib/db';
import { apiEndpoint } from '$lib/helpers/endpoints';
import { Queries } from '@mpa/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = apiEndpoint<RequestHandler>(async ({ url }) => {
  const search = url.searchParams.get('q') || '';
  const pages = await db.page.search(search, Queries.pageForCollectionCard, false);
  return json({ pages: pages.map(p => p.id) });
});
