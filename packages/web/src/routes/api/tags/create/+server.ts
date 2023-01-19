import type { APIRequests } from '@mpa/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { apiEndpoint } from '$lib/helpers/endpoints';

export const PUT = apiEndpoint<RequestHandler>(async ({ request }) => {
  const body = (await request.json()) as APIRequests.Tag;
  const tag = await db.tag.create(body);
  return json(tag);
});
