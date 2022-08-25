import type { APIRequests } from '@mpa/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';

export const PUT: RequestHandler = async ({ request }) => {
  const body = (await request.json()) as APIRequests.Author;
  const author = await db.author.create(body);
  return json(author);
};
