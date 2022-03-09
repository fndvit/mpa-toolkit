import type { GetSession } from '@sveltejs/kit';
import { auth } from '$lib/auth';


export const getSession: GetSession = async (event) => {
  // only get the session on cms routes
  const re = /^\/cms\b/.exec(event.url.pathname);
  if (re) {
    return auth.getSession(event);
  }
};
