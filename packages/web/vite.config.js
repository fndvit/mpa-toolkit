import { sveltekit } from '@sveltejs/kit/vite';
import svg from '@poppanator/sveltekit-svg';

/** @type {import('vite').UserConfig} */
const config = {
  optimizeDeps: {
    // entries: ['@mpa/db > @mpa/log > chalk', '@mpa/log'],
    // include: ['@mpa/db > @mpa/log > chalk']
    // exclude: ['@mpa/db > @mpa/log > chalk']
    // include: ['@mpa/env']
    // einclude: ['@mpa/env']
    // include: ['@mpa/db > @mpa/log']
  },

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
};

export default config;
