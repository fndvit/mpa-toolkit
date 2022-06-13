import adapter from '@mpa-toolkit/adapter';
import preprocess from 'svelte-preprocess';
import svg from '@poppanator/sveltekit-svg'

const globalStylus = `
  @require './src/lib/styles/svelte-global'
`;

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    cssHash: ({hash, css}) => `mpa-${hash(css)}`
  },
	preprocess: preprocess({
    stylus: {
      prependData: globalStylus
    },
  }),

	kit: {
		adapter: adapter({}),
    vite: {
      plugins: [
        svg({
          includePaths: ["./src/lib/svg/"],
          svgoOptions: false,
        }),
      ]
    }
	}
};

export default config;
