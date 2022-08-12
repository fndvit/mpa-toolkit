/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Readable, Writable } from 'svelte/store';
import type { IdConfiguration } from 'google-one-tap';
import { env } from '$env/dynamic/public';
import type { RequestHandler } from '@sveltejs/kit';
import type { Role } from '@prisma/client';

type Page = Readable<{
  url: URL;
  params: Record<string, string>;
  stuff: App.Stuff;
  status: number;
  error: Error | null;
}>;

export default function useAuth(
  page: Page,
  session: Writable<any>,
  goto: (
    url: string | URL,
    opts?: { replaceState?: boolean; noscroll?: boolean; keepfocus?: boolean; state?: any }
  ) => Promise<any>
) {
  let sessionValue: App.Session;
  session.subscribe(value => {
    sessionValue = value;
  });

  let referrer: string | null;
  page.subscribe(value => {
    referrer = value.url.searchParams.get('referrer');
  });

  const loadScript = () =>
    new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.id = 'gsiScript';
      script.async = true;
      script.src = 'https://accounts.google.com/gsi/client';
      script.onerror = error => reject(error);
      script.onload = () => resolve(script);
      document.body.appendChild(script);
    });

  function googleAccountsIdInitialize() {
    return window.google.accounts.id.initialize({
      client_id: env.PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
      callback: googleCallback
    });
  }

  function googleAccountsIdRenderButton(htmlId: string) {
    return window.google.accounts.id.renderButton(document.getElementById(htmlId), {
      theme: 'filled_blue',
      size: 'large',
      width: 367
    });
  }

  function initializeSignInWithGoogle(htmlId?: string) {
    googleAccountsIdInitialize();

    if (htmlId) {
      return googleAccountsIdRenderButton(htmlId);
    }

    if (!sessionValue.user) window.google.accounts.id.prompt();
  }

  const googleCallback: IdConfiguration['callback'] = async response => {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: response.credential })
    });
    const fromEndpoint = await res.json();

    if (res.ok) {
      session.set({ user: fromEndpoint.user });
      goto(referrer ?? '/cms', { replaceState: true });
    }
  };

  return { loadScript, initializeSignInWithGoogle };
}

function roleCheck(userRole: Role, requiredRole: Role) {
  const ROLE_VALUES = {
    USER: 0,
    CONTENT_MANAGER: 1,
    ADMIN: 2
  };
  return ROLE_VALUES[userRole] >= ROLE_VALUES[requiredRole];
}

export function authMiddleware(opts: { role: Role; redirect?: string }, handler: RequestHandler): RequestHandler {
  return async event => {
    if (!event.locals.user) {
      // not signed in
      return event.url.pathname.startsWith('/api/')
        ? { status: 401, body: { error: 'Unauthorized' } }
        : { status: 302, headers: { Location: `/cms/login?referrer=${encodeURIComponent(event.url.pathname)}` } };
    }

    if (!roleCheck(event.locals.user.role, opts.role)) {
      return {
        status: 401,
        body: { error: 'Not authorized' }
      };
    } else {
      return handler(event);
    }
  };
}
