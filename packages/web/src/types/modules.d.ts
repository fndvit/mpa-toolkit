declare module 'svelte-scrollto' {
  export const scrollTo: (options: Record<string, unknown>) => void;
}

declare module 'postcss-color-function' {
  export default () => import('postcss').Plugin;
}

declare module '*.svg' {
  export default import('svelte').SvelteComponent;
}
