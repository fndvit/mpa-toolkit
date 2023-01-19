import { db } from '$lib/db';
import { apiEndpoint } from '$lib/helpers/endpoints';
import type { APIRequests } from '@mpa/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT = apiEndpoint<RequestHandler>(async ({ request }) => {
  const body = (await request.json()) as APIRequests.Page;
  const page = await db.page.create(body);
  return json(page);
});
