import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/image-optimizer/bin'],
  outDir: 'dist/image-optimizer/bin',
  format: ['cjs'],
  bundle: true,
  splitting: true
});
