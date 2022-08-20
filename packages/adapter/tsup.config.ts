import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  entry: ['src', '!src/lambda/*.js'],
  format: ['esm'],
  loader: {
    '.gql': 'text',
    '.repo': 'text'
  },
  noExternal: ['@mpa/env', '@mpa/migration-runner', '@mpa/env/load', '@mpa/log'],
  external: ['SERVER', 'MANIFEST', 'STATIC'],
  splitting: false
});
