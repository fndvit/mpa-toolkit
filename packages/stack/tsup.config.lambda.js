import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/lambda'],
  outDir: 'dist/lambda',
  format: ['esm'],
  external: ['SERVER', 'MANIFEST', 'STATIC', 'aws-sdk', 'aws-xray-sdk-core'],
  splitting: false
});
