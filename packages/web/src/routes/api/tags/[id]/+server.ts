import type { APIRequests } from '@mpa/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { apiEndpoint } from '$lib/helpers/endpoints';

export const PATCH = apiEndpoint<RequestHandler>(async ({ request, params }) => {
  const body = (await request.json()) as APIRequests.Tag;

  const tag = await db.tag.update(parseInt(params.id), body);
  return json(tag);
});

export const DELETE = apiEndpoint<RequestHandler>(async ({ params }) => {
  const tagId = parseInt(params.id);

  await db.tag.delete(tagId);

  return json({ status: 'ok' });
});
