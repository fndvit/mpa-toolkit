import type { APIRequests } from '@mpa/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';

export const GET: RequestHandler = async ({ url }) => {
  const madlib = url.searchParams.get('madlib');
  const pageviews = url.searchParams.get('pageviews');
  const type = url.searchParams.get('type') as 'chapter' | 'case-study';
  const referencePageId = parseInt(url.searchParams.get('referencePageId'));

  const userHistory: APIRequests.Recommendations = {
    madlib: madlib?.split(',').map(answer => answer.trim()),
    pageviews: pageviews?.split(',').map(pageId => parseInt(pageId.trim()))
  };

  const pageIds = await db.page.recommender(type, userHistory, referencePageId);
  const cards = await db.page.cards(pageIds);

  return json(cards);
};
