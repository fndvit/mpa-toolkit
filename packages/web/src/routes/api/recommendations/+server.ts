import type { APIRequests, Page } from '@mpa/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';

export const GET: RequestHandler = async ({ url }) => {
  const madlib = url.searchParams.get('madlib');
  const pageviews = url.searchParams.get('pageviews');
  const type = url.searchParams.get('type') as 'chapter' | 'case-study';
  const referencePageId = parseInt(url.searchParams.get('referencePageId'));

  const userHistory: APIRequests.Recommendations = {
    madlib: madlib !== 'undefined' ? madlib.split(',').map((answer) => answer.trim()) : null,
    pageviews: pageviews !== 'undefined' ? pageviews.split(',').map((pageId) => parseInt(pageId.trim())) : null
  };

  const recommendations: Page.ContentCard[] = await db.page.recommender(userHistory, type, referencePageId);

  return json(recommendations);
};
