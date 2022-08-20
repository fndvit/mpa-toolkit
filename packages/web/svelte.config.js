// @ts-check
import adapter from '@mpa/adapter';
// import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

const globalStylePath = new URL('./src/lib/styles/svelte-global', import.meta.url);

const globalStylus = `
  @require '${globalStylePath.pathname}';
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
