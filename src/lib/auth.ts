import { JWT, SvelteKitAuth } from "sk-auth";
import { GoogleOAuth2Provider } from "sk-auth/providers";
import { prisma } from '$lib/prisma';
import { logger } from "./log";
import type { RequestHandler } from "@sveltejs/kit";
import type { Role } from "@prisma/client";

const log = logger.child({module: 'auth'});

interface GoogleProfile {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean,
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

  log.info('User not found, creating...');

  return prisma.user.create({
    data: {
      googleId: profile.sub,
      name: profile.name,
      email: profile.email
    }
  });
};

export const auth = new SvelteKitAuth({
  protocol: 'http',
  providers: [
    new GoogleOAuth2Provider({
      clientId: process.env['GOOGLE_OAUTH_CLIENT_ID'],
      clientSecret: process.env['GOOGLE_OAUTH_CLIENT_SECRET'],
      profile(profile) {
        return { ...profile, provider: "google" };
      }
    })
  ],
  callbacks: {
    redirect: url => {
      return '/cms';
    },
    async jwt(token, profile) {
      if (profile?.provider === 'google') {
        log.info(`User login via Google: ${profile.sub}`);
        const user = await getOrCreateUser(profile);
        const { id, email, name } = user;
        token = { ...token,
          user: { id, email, name }
        };
      }
      return token;
    },
  },
  jwtSecret: process.env['JWT_SECRET_KEY'],
});

function roleCheck(userRole: Role, requiredRole: Role) {
  const ROLE_VALUES = {
    USER: 0,
    CONTENT_MANAGER: 1,
    ADMIN: 2,
  };
  return ROLE_VALUES[userRole] >= ROLE_VALUES[requiredRole];
}

async function isAuthorized(token: JWT, requiredRole: Role) {
  const user = await prisma.user.findUnique({
    where: { id: token.user.id }
  });
  if (!user) {
    return false;
  }
  return roleCheck(user.role, requiredRole);
}

export function authMiddleware(opts: { role: Role, redirect?: string }, handler: RequestHandler): RequestHandler {
  return async event => {
    const token = await auth.getToken(event.request.headers);
    if (token) {
      if (await isAuthorized(token, opts.role)) {
        return handler(event);
      } else {
        return {
          status: 401,
          body: { error: 'Not authorized' }
        };
      }
    } else {
      if (opts.redirect) {
        return {
          status: 302,
          headers: { Location: opts.redirect },
        };
      }
      else {
        return {
          status: 401,
          body: { error: 'Not logged in' }
        };
      }
    }
  };
}