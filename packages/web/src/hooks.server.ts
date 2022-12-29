import { logger } from '@mpa/log';
import { json, type Handle } from '@sveltejs/kit';
import AWSXRay from 'aws-xray-sdk-core';
import { env } from '$lib/env';
import { checkUserHasRoleForRoute, getUserFromCookie } from '$lib/auth';
import { getPageMetadata } from '$lib/metadata';

const log = logger('HOOKS');

if (env.DISABLE_CACHE === 'true') {
  log.debug('Caching headers disabled by env var DISABLE_CACHE');
}

const PRIVATE_CACHE = 'private, max-age=0';
const DEFAULT_CACHE = PRIVATE_CACHE;

const ROUTE_CACHE = {
  routes: {
    '/': 's-maxage=604800, max-age=0', // index/homepage route
    '/[slug]': 's-maxage=604800, max-age=0',
    '/search': 's-maxage=604800, max-age=0',
    '/globe.svg': 'max-age=604800'
  },
  regexp: [{ re: /^(api|cms)\b/, cache: PRIVATE_CACHE }]
};

function getCacheControl(routeId: string): string {
  const caching = ROUTE_CACHE.routes[routeId] || ROUTE_CACHE.regexp.find(r => r.re.test(routeId))?.cache;
  if (!caching) {
    log.debug(`missing cache config for ${routeId}`);
  }
  return caching || DEFAULT_CACHE;
}

interface CacheHeaders {
  'Cache-Control'?: string;
  'Surrogate-Key'?: string;
  'Surrogate-Control'?: string;
}

function getCacheHeaders(routeId: string, cacheKeys: App.Locals['cacheKeys']): CacheHeaders {
  if (routeId == null) return {};
  return {
    'Cache-Control': `${getCacheControl(routeId)}, stale-while-revalidate=30, stale-if-error=3600`,
    'Surrogate-Key': cacheKeys.size > 0 ? Array.from(cacheKeys).join(' ') : undefined
  };
}

export const handle: Handle = async ({ event, resolve }) => {
  const seg = AWSXRay.getSegment()?.addNewSubsegment('handle');
  const { route } = event;
  event.locals.user = await getUserFromCookie(event.cookies);
  seg?.addMetadata('user', event.locals.user);

  if (/^api\b/.test(route.id) && !checkUserHasRoleForRoute(route.id, event.locals.user)) {
    return json({ error: 'You do not have permission to access this page' }, { status: 400 });
  }

  event.locals.cacheKeys = new Set(['all']);
  event.locals.withMetadata = data => ({
    ...data,
    metadata: getPageMetadata(event.route.id, data)
  });

  const response = await AWSXRay.captureAsyncFunc('resolve', () => resolve(event));

  seg?.addMetadata('cacheKeys', [...event.locals.cacheKeys]);

  if (env.DISABLE_CACHE === 'true' || /^50\d$/.test(response.status.toString())) {
    response.headers.set('Cache-Control', PRIVATE_CACHE);
  } else {
    const cacheHeaders = getCacheHeaders(route.id!, event.locals.cacheKeys);
    for (const [key, value] of Object.entries(cacheHeaders)) {
      if (value != null) response.headers.set(key, value);
    }
  }

  seg?.close();

  return response;
};
