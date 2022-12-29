/// <reference types="@sveltejs/kit" />

declare namespace App {
  export interface Locals {
    cacheKeys: Set<string>;
    user?: import('@mpa/db').User.Session;
    withMetadata: <T>(data: T) => T & { metadata: import('$lib/metadata').PageMetadata };
  }
}

interface Window {
  google?: typeof import('google-one-tap');
}
