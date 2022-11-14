import fs from 'fs';
import path from 'path';
import depcheck from 'depcheck';
import { Listr, type ListrTask } from 'listr2';
import { globby } from 'globby';
import projectRoot from '@mpa/utils/projectRoot';
import chalk from 'chalk';

interface Options {
  ignoreMatches: string[];
}

async function main({ ignoreMatches }: Options) {
  const root = await projectRoot();
  const gitIgnore = fs.readFileSync(`${root}/.gitignore`, 'utf-8').split('\n').filter(Boolean);
  const packagesDir = `${root}/packages`;
  const packages = await globby(`*`, {
    onlyDirectories: true,
    cwd: packagesDir
  });

  const relativePath = (p: string, project: string) => path.relative(`${root}/packages/${project}`, p);

  type Ctx = Record<string, depcheck.Results>;
  const ctx: Ctx = {};

  const tasks: ListrTask<Ctx>[] = packages.map(p => {
    return {
      title: p,
      task: async (ctx, task) => {
        const result = await depcheck(`${packagesDir}/${p}`, { ignorePatterns: gitIgnore, ignoreMatches });

        const unusedLogLine = (key: string) => {
          const unused = result[key];
          const color = unused.length === 0 ? chalk.green : chalk.yellow;
          const unusedStr = unused.map(u => `\n${color.grey('∙')}   ${u}`).join();
          return `${color(`${unused.length} unused ${key}`)} ${unusedStr}`;
        };

        const missingLogLine = () => {
          const missing = result.missing;
          const missingNames = Object.keys(missing);
          const color = missingNames.length === 0 ? chalk.green : chalk.yellow;
          const str = `${color(`${missingNames.length} missing`)}`;
          const tree = missingNames
            .map(name => {
              const head = `\n›  ${name}\n`;
              const files = missing[name].map(file => `${color.grey('∙')}   ${relativePath(file, p)}`).join('\n');
              return head + files;
            })
            .join('\n');
          return str + tree;
        };

        const log = [unusedLogLine('dependencies'), unusedLogLine('devDependencies'), missingLogLine()];

        task.output = log.join('\n');
        ctx[p] = result;
      },
      options: {
        persistentOutput: true
      }
    };
  });

  const listr = new Listr<Ctx>(tasks, {
    concurrent: true,
    ctx,

    rendererOptions: {
      collapse: false
    }
  });

  await listr.run();
}

main({ ignoreMatches: ['$lib', '$env', 'STATIC', 'MANIFEST', 'SERVER'] }).catch(err => console.log(err));
