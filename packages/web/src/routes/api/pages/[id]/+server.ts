import type { APIRequests } from '@mpa/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { apiEndpoint } from '$lib/helpers/endpoints';

export const PATCH = apiEndpoint<RequestHandler>(async ({ request, params }) => {
  const body = (await request.json()) as APIRequests.Page;
  const page = await db.page.update(parseInt(params.id), body);
  return json(page);
});

export const DELETE = apiEndpoint<RequestHandler>(async ({ params }) => {
  const pageId = parseInt(params.id);
  await db.page.delete(pageId);
  return json({ status: 'ok' });
});
