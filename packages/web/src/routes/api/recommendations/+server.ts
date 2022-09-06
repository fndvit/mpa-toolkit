import type { Page } from '@mpa/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';

export const GET: RequestHandler = async ({ url }) => {
  const madlib = url.searchParams.get('madlib');
  const pageviews = url.searchParams.get('pageviews');

  const tags = madlib ? await db.tag.get(madlib.split(',')) : null;
  const pageIds = pageviews?.split(',').map(s => parseInt(s));

  // TODO: get recommendations
  const recommendations: Page.ContentCard[] = [];

  return json(recommendations);
};
