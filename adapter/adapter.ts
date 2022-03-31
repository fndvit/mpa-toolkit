import {
  copyFileSync,
  unlinkSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'fs';
import fsextra from 'fs-extra';
import { join } from 'path';
import * as esbuild from 'esbuild';
import { Builder } from '@sveltejs/kit';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { emptyDirSync } = fsextra;

interface AWSAdapterProps {
  artifactPath?: string;
  autoDeploy?: boolean;
  cdkProjectPath: string;
  stackName?: string;
  FQDN?: string;
  env?: { [key: string]: string };
}

export default function adapter({
  artifactPath = 'build'
}: AWSAdapterProps) {
  /** @type {import('@sveltejs/kit').Adapter} */
  return {
    name: 'adapter-awscdk',
    async adapt(builder: Builder) {
      emptyDirSync(artifactPath);

      const prepareBuildDir = (dir: string) => {
        const path = join(artifactPath, dir);
        if (!existsSync(path)) {
          mkdirSync(path, { recursive: true });
        }
        return path;
      };

      const static_directory = prepareBuildDir('assets');
      const prerendered_directory = prepareBuildDir('prerendered');
      const server_directory = prepareBuildDir('server');
      const handler_directory = prepareBuildDir('handler');
      const edge_directory = prepareBuildDir('edge');

      builder.writeClient(static_directory);
      builder.writePrerendered(prerendered_directory);
      builder.writeStatic(static_directory);
      builder.writeServer(server_directory);

      builder.log.minor('Copying server files.');
      copyFileSync(`${__dirname}/lambda/handler.js`, `${handler_directory}/index.js`);
      copyFileSync(`${__dirname}/lambda/shims.js`, `${handler_directory}/shims.js`);

      builder.log.minor('Building Lambda@Edge routing function.');
      copyFileSync(`${__dirname}/lambda/router.js`, `${edge_directory}/_index.js`);
      const files = JSON.stringify([...getAllFiles(static_directory), ...getAllFiles(prerendered_directory)]);
      writeFileSync(`${edge_directory}/static.js`, `export default ${files}`);

      esbuild.buildSync({
        entryPoints: [`${edge_directory}/_index.js`],
        outfile: `${edge_directory}/index.js`,
        format: 'cjs',
        bundle: true,
        platform: 'node',
      });

      unlinkSync(`${edge_directory}/_index.js`);

      builder.log.minor('Deploy using AWS-CDK.');

      builder.log.minor('Done.');
    },
  };
}

const getAllFiles = function (dirPath: string, basePath?: string, arrayOfFiles: string[] = []) {
  basePath = basePath || dirPath;

  readdirSync(dirPath).forEach(function (file) {
    if (statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, basePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(join('/', dirPath.replace(basePath!, ''), '/', file));
    }
  });

  return arrayOfFiles;
};
