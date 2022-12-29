import { defineConfig } from 'tsup';

export default defineConfig(options => {
  const DEV = options.watch;
  return {
    entry: ['src/index.ts'],
    sourcemap: DEV ? 'inline' : false,
    format: ['esm']
  };
});
