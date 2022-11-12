// @ts-check
import { fileURLToPath } from 'url';
import adapter from '@mpa/stack';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    cssHash: ({ hash, css }) => `mpa-${hash(css)}`
  },

  preprocess: preprocess({
    stylus: {
      prependData: `@require 'svelte-global';\n`,
      paths: [fileURLToPath(new URL('./src/lib/styles', import.meta.url))]
    }
  }),

  kit: {
    adapter: adapter(),
    prerender: {
      enabled: false
    }
  }
};

export default config;
