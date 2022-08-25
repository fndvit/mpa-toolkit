import type { APIRequests } from '@mpa/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';

export const PATCH: RequestHandler = async ({ params, request }) => {
  const body = (await request.json()) as APIRequests.User;
  const user = await db.user.update(parseInt(params.id), body);
  return json({ user });
};

export const DELETE: RequestHandler = async ({ params }) => {
  const userId = parseInt(params.id);
  await db.user.delete(userId);
  return json({ status: 'ok' });
};
