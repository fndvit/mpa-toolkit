/// <reference types="@sveltejs/kit" />

interface ImportMetaEnv {
  VITE_AWS_S3_BUCKET: string;
}

declare namespace App {
	export interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'ADMIN' | 'USER' | 'CONTENT_MANAGER';
    }
  }
}

declare module 'svelte-scrollto' {
  export const scrollTo;
}

type ObjectKeys<T> =
  T extends object ? (keyof T)[] :
  T extends number ? [] :
  T extends Array<any> | string ? string[] :
  never;

interface ObjectConstructor {
  keys<T>(o: T): ObjectKeys<T>
  fromEntries<T extends [any, any][]>(o: T): T extends [infer K, infer V][] ? Record<K, V> : never
}