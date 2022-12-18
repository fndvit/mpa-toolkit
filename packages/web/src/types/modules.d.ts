import type { SvelteComponent } from 'svelte';

declare module 'svelte-scrollto' {
  export const scrollTo: (options: Record<string, unknown>) => void;
}

declare module 'postcss-color-function' {
  export default () => import('postcss').Plugin;
}

declare module '*.svg' {
  // const src: string;
  export default SvelteComponent;
}
