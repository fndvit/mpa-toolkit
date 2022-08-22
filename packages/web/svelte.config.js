// @ts-check
import { fileURLToPath } from 'url';
import adapter from '@mpa/adapter';
import preprocess from 'svelte-preprocess';

const globalStylePath = fileURLToPath(new URL('./src/lib/styles/svelte-global', import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    cssHash: ({ hash, css }) => `mpa-${hash(css)}`
  },

  preprocess: preprocess({
    stylus: {
      prependData: `@require '${globalStylePath}';\n`
    }
  }),

  kit: {
    adapter: adapter()
  }
};

export default config;
