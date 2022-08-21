import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { db } from '$lib/db';

export const POST: RequestHandler = async event => {
  if (event.locals.user) {
    await db.session.end(event.locals.user.id);
  }
  return json(
    {
      message: 'Logout successful.'
    },
    {
      headers: {
        'set-cookie': `session=; Path=/; SameSite=Lax; HttpOnly; Expires=${new Date().toUTCString()}`
      }
    }
  );
};
