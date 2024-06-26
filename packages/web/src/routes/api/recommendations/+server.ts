import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { apiEndpoint } from '$lib/helpers/endpoints';

export const GET = apiEndpoint<RequestHandler>(async ({ url }) => {
  const madlib = url.searchParams.get('madlib');
  const pageviews = url.searchParams.get('pageviews');
  const type = url.searchParams.get('type') as 'chapter' | 'case-study';
  const referencePageId = parseInt(url.searchParams.get('referencePageId'));

  const pageIds = await db.page.recommender(type, {
    madlib: madlib?.split('+') || [],
    pageviews: pageviews?.split('+').map(id => parseInt(id)) || [],
    referencePageId
  });
  const cards = await db.page.cards(pageIds);

  return json(cards);
});
