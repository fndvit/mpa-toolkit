import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  entry: ["src"],
  format: ["esm"],
  loader: {
    '.gql': 'text'
  },
  external: [
    "../server/index.js",
    "../server/manifest.js",
    "./static.js"
  ],
  splitting: false
});
