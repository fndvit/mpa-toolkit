import { sveltekit } from '@sveltejs/kit/vite';
import svg from '@poppanator/sveltekit-svg';
import { defineConfig } from 'vite';

const config = defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: false
    },
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },

  plugins: [
    sveltekit(),

    svg({
      includePaths: ['./src/lib/svg/'],
      svgoOptions: false
    })
  ]
});

export default config;
