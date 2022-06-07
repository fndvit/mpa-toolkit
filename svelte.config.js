import adapter from '@mpa-toolkit/adapter';
import preprocess from 'svelte-preprocess';
import svg from '@poppanator/sveltekit-svg'


const globalSCSS = `
@use "./src/lib/styles/color/mixins.scss" as *;
@use "./src/lib/styles/typography/mixins.scss" as *;
`;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
    scss: {
      prependData: globalSCSS
    }
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
