import { logger } from '@mpa/log';
import { json, type Handle } from '@sveltejs/kit';
import { checkUserHasRoleForRoute, getUserFromCookie } from '$lib/auth';

const log = logger('HOOKS');

const RouteCache: { [routeId: string]: string } = {
  '': 's-maxage=604800, max-age=0', // index/homepage route
  '[slug]': 's-maxage=604800, max-age=0',
  search: 's-maxage=604800, max-age=0',
  'globe.svg': 'max-age=604800'
};

const DEFAULT_CACHE = 'private, max-age=0';

function getCacheControl(routeId: string): string {
  if (!(routeId in RouteCache)) {
    log.info(`missing cache config for ${routeId}`);
  }
  return RouteCache[routeId] || DEFAULT_CACHE;
}

interface CacheHeaders {
  'Cache-Control'?: string;
  'Surrogate-Key'?: string;
  'Surrogate-Control'?: string;
}

function getCacheHeaders(routeId: string, cacheKeys: App.Locals['cacheKeys']): CacheHeaders {
  if (routeId == null) return {};
  return {
    'Cache-Control': getCacheControl(routeId),
    'Surrogate-Key': cacheKeys.size > 0 ? Array.from(cacheKeys).join(' ') : undefined,
    'Surrogate-Control': 'stale-while-revalidate=30, stale-if-error=3600'
  };
}

export const handle: Handle = async ({ event, resolve }) => {
  const { routeId } = event;
  event.locals.user = await getUserFromCookie(event.request, event.setHeaders);

  if (/^api\b/.test(routeId) && !checkUserHasRoleForRoute(routeId, event.locals.user)) {
    return json({ error: 'You do not have permission to access this page' }, { status: 400 });
  }

  event.locals.cacheKeys = new Set();

  const response = await resolve(event);

  if (response.ok) {
    const cacheHeaders = getCacheHeaders(event.routeId!, event.locals.cacheKeys);
    for (const [key, value] of Object.entries(cacheHeaders)) {
      if (value != null) response.headers.set(key, value);
    }
  }
  return response;
};
