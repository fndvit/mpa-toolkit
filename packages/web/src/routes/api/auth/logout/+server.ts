import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { db } from '$lib/db';

export const POST: RequestHandler = async ({ locals, cookies }) => {
  if (locals.user) {
    await db.session.end(locals.user.id);
  }
  cookies.delete('session');
  return json({ message: 'Logout successful.' });
};
