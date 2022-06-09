import adapter from '@mpa-toolkit/adapter';
import preprocess from 'svelte-preprocess';
import svg from '@poppanator/sveltekit-svg'

const globalStylus = `
  @require './src/lib/styles/global'
`;

/** @type {import('@sveltejs/kit').Config} */
const config = {
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
