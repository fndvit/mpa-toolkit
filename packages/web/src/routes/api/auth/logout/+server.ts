import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { apiEndpoint } from '$lib/helpers/endpoints';

export const POST = apiEndpoint<RequestHandler>(async ({ locals, cookies }) => {
  if (locals.user) {
    await db.session.end(locals.user.id);
  }
  cookies.delete('session');
  return json({ message: 'Logout successful.' });
});
