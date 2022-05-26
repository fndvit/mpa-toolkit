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
