import type { Role, User } from '@mpa/db';
import { logger } from '@mpa/log';
import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/db';

const log = logger('AUTH');

const REQUIRED_ROLES: { [routeId: string]: Role | null } = {
  '/cms/login': null,

  '/cms': 'CONTENT_MANAGER', // prettier-ignore
  '/cms/authors': 'CONTENT_MANAGER',
  '/cms/homepage': 'CONTENT_MANAGER',
  '/cms/pages': 'CONTENT_MANAGER',
  '/cms/pages/[id]': 'CONTENT_MANAGER',
  '/cms/pages/create/case-study': 'CONTENT_MANAGER',
  '/cms/pages/create/chapter': 'CONTENT_MANAGER',
  '/cms/tags': 'CONTENT_MANAGER',
  '/cms/users': 'CONTENT_MANAGER',
  '/cms/dump': 'ADMIN',

  '/draft/[slug]': 'CONTENT_MANAGER',

  '/api': null, // prettier-ignore
  '/api/auth/google': null,
  '/api/auth/logout': 'CONTENT_MANAGER',
  '/api/authors/[id]': 'CONTENT_MANAGER',
  '/api/authors/create': 'CONTENT_MANAGER',
  '/api/image/upload': 'CONTENT_MANAGER',
  '/api/pages/[id]': 'CONTENT_MANAGER',
  '/api/pages/create': 'CONTENT_MANAGER',
  '/api/tags/[id]': 'CONTENT_MANAGER',
  '/api/tags/create': 'CONTENT_MANAGER',
  '/api/users/[id]': 'ADMIN',
  '/api/dump': 'ADMIN',
  '/api/link': 'CONTENT_MANAGER',
  '/api/recommendations': null
};

export async function getUserFromCookie(cookies: RequestEvent['cookies']) {
  const sessionCookie = cookies.get('session');
  if (sessionCookie) {
    const session = await db.session.get(sessionCookie);
    if (!session || session.expires < new Date()) {
      // invalid session cookie
      cookies.delete('session');
    } else {
      return session.user;
    }
  }
}

function roleCheck(userRole: Role, requiredRole: Role) {
  const ROLE_VALUES = { USER: 0, CONTENT_MANAGER: 1, ADMIN: 2 };
  return ROLE_VALUES[userRole] >= ROLE_VALUES[requiredRole];
}

function getRequiredRole(routeId): Role {
  if (REQUIRED_ROLES[routeId] === undefined && /^(api\b|cms\b)/g.test(routeId)) {
    log.warn(`No explicit role defined for route '/${routeId}'. Defaulting to 'ADMIN'.`);
    return 'ADMIN';
  }
  return REQUIRED_ROLES[routeId];
}

export function checkUserHasRoleForRoute(routeId: string, user: User) {
  const reqRole = getRequiredRole(routeId);
  if (!user) return !reqRole;
  if (!reqRole) return true;
  return roleCheck(user.role, reqRole);
}
