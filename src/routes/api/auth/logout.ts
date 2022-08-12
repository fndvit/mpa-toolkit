import { endSession } from '$lib/prisma/wrappers';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async event => {
  if (event.locals.user) {
    await endSession(event.locals.user.id);
  }
  return {
    status: 200,
    headers: {
      'Set-Cookie': `session=; Path=/; SameSite=Lax; HttpOnly; Expires=${new Date().toUTCString()}`
    },
    body: {
      message: 'Logout successful.'
    }
  };
};
