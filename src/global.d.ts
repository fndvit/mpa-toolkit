/// <reference types="@sveltejs/kit" />

// import type { User } from '$lib/prisma/queries';

// import type { SubTypes } from '$lib/types';

interface ImportMetaEnv {
  VITE_AWS_S3_BUCKET: string;
}

declare namespace App {
  export interface Session {
    user?: {
      id: number;
      email: string;
      name: string;
      role: 'ADMIN' | 'USER' | 'CONTENT_MANAGER';
    };
  }

  export interface Locals {
    cacheKeys?: Set<string>;
    user?: Session['user'];
  }
}

declare module 'svelte-scrollto' {
  export const scrollTo;
}

interface ObjectConstructor {
  fromEntries<T extends [unknown, unknown][]>(o: T): T extends [infer K, infer V][] ? Record<K, V> : never;
}

// type UserSession = {
//   id: string;
//   user: User;
// };

interface Window {
  google?: typeof import('google-one-tap');
}
