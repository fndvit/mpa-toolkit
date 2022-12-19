import { defineConfig } from 'tsup';

export default defineConfig(options => {
  const DEV = options.watch;
  if (DEV) {
    return {
      entry: ['src'],
      bundle: false,
      sourcemap: 'inline',
      loader: { '.json': 'copy' },
      format: ['esm']
    };
  } else {
    return {
      entry: ['src/index.ts'],
      format: ['esm']
    };
  }
});
