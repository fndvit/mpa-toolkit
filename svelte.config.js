import adapter from '@mpa-toolkit/adapter';
import preprocess from 'svelte-preprocess';
import svg from '@poppanator/sveltekit-svg'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
    scss: {
      prependData: `@use "./src/lib/styles/typography/mixins.scss" as *;`
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
