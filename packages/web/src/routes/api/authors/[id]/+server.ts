import type { APIRequests } from '@mpa/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';

export const PATCH: RequestHandler = async ({ request, params }) => {
  const body = (await request.json()) as APIRequests.Author;

  const author = await db.author.update(parseInt(params.id), body);

  return json(author);
};

export const DELETE: RequestHandler = async ({ params }) => {
  await db.author.delete(parseInt(params.id));

  return json({ status: 'ok' });
};
