// @ts-check
import path from 'path';
import adapter from '@mpa/adapter';
import preprocess from 'svelte-preprocess';

const globalStylePath = path.resolve(process.cwd(), './src/lib/styles/svelte-global');

const globalStylus = `
  @require '${globalStylePath}';
`;

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    cssHash: ({ hash, css }) => `mpa-${hash(css)}`
  },

  preprocess: preprocess({
    stylus: {
      prependData: globalStylus
    }
  }),

  kit: {
    adapter: adapter()
  }
};

export default config;
