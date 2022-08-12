import type { RequestHandler } from '@sveltejs/kit';
import { SvelteKitAuth } from 'sk-auth';
import { GoogleOAuth2Provider } from 'sk-auth/providers';
import { prisma } from '$lib/prisma';
import { logger } from './log';
import env from './env';

// weird import workaround here because of how prisma's
// generated files interact with svelte-kit prod builds
import PrismaClient from '@prisma/client';
import type { Role as _Role } from '@prisma/client';
const Role = PrismaClient.Role;

const log = logger.child({ module: 'auth' });

interface GoogleProfile {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
  provider: string;
}

const getOrCreateUser = async (profile: GoogleProfile) => {
  const user = await prisma.user.findUnique({
    where: {
      googleId: profile.sub
    }
  });

  if (user) {
    log.info(`User found: ${user.id}`);
    return user;
  }

  const realUser = await prisma.user.findFirst({
    where: { NOT: { googleId: null } }
  });

  const isFirstUser = realUser === null;

  log.info(isFirstUser ? 'First user, creating admin...' : 'User not found, creating...');

  return prisma.user.create({
    data: {
      googleId: profile.sub,
      name: profile.name,
      email: profile.email,
      role: isFirstUser ? Role.ADMIN : Role.USER
    }
  });
};

export const auth = new SvelteKitAuth({
  protocol: env.protocol,
  host: env.host,
  providers: [
    new GoogleOAuth2Provider({
      clientId: env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
      profile(profile) {
        return { ...profile, provider: 'google' };
      }
    })
  ],
  callbacks: {
    redirect: () => {
      return '/cms';
    },
    async jwt(token, profile) {
      if (profile?.provider === 'google') {
        log.info(`User login via Google: ${profile.sub}`);
        const user = await getOrCreateUser(profile);
        const { id } = user;
        token = { ...token, user: { id } };
      }
      return token;
    }
  },
  jwtSecret: env.JWT_SECRET_KEY
});

function roleCheck(userRole: _Role, requiredRole: _Role) {
  const ROLE_VALUES = {
    USER: 0,
    CONTENT_MANAGER: 1,
    ADMIN: 2
  };
  return ROLE_VALUES[userRole] >= ROLE_VALUES[requiredRole];
}

export function authMiddleware(opts: { role: _Role; redirect?: string }, handler: RequestHandler): RequestHandler {
  return async event => {
    const token = await auth.getToken(event.request.headers);
    const isApi = event.url.pathname.startsWith('/api/');

    if (!token?.user) {
      // not signed in
      return isApi
        ? { status: 401, body: { error: 'Unauthorized' } }
        : { status: 302, headers: { Location: await auth.getRedirectUrl(opts.redirect || '/cms') } };
    }

    const user = await prisma.user.findUnique({ where: { id: token.user.id } });

    if (!user) {
      // invalid user so clear the token
      const token = auth.setToken(event.request.headers, {});
      const jwt = auth.signToken(token);
      return isApi
        ? {
            status: 400,
            headers: { 'set-cookie': `svelteauthjwt=${jwt}; Path=/; HttpOnly` },
            body: { error: 'Invalid user token' }
          }
        : {
            status: 302,
            headers: {
              'set-cookie': `svelteauthjwt=${jwt}; Path=/; HttpOnly`,
              Location: '/api/auth/signin/google'
            }
          };
    } else if (!roleCheck(user.role, opts.role)) {
      // valid user but not authorized
      return {
        status: 401,
        body: { error: 'Not authorized' }
      };
    } else {
      return handler(event);
    }
  };
}
