import { sveltekit } from '@sveltejs/kit/vite';
import svg from '@poppanator/sveltekit-svg';
/** @type {import('vite').UserConfig} */
const config = {
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  plugins: [
    sveltekit(),
    svg({
      includePaths: ['./src/lib/svg/'],
      svgoOptions: false
    })
  ]
};

export default config;
