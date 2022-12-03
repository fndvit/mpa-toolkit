import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/stack.ts', 'src/global.d.ts'],
  format: ['esm'],
  external: ['esbuild'],
  loader: {
    '.gql': 'text',
    '.repo': 'text'
  },
  splitting: true
});
