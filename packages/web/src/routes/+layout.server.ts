import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { checkUserHasRoleForRoute } from '$lib/auth';
import { getPageMetadata } from '$lib/metadata';

export const load: LayoutServerLoad = async ({ url, locals, route }) => {
  const hasPerms = checkUserHasRoleForRoute(route.id, locals.user);
  if (!hasPerms) {
    if (locals.user) throw error(403, 'You do not have permission to access this page');
    else {
      const referrer = url.pathname + url.search;
      throw redirect(302, `/cms/login?referrer=${referrer}`);
    }
  }

  return { user: locals.user, metadata: getPageMetadata(route.id), routeId: route.id };
};
