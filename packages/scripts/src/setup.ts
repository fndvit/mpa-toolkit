/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ListrTask } from 'listr2';
import { Listr } from 'listr2';
import shell from 'shelljs';

const rootDir = '../..';

const initCommands: Command[] = [
  {
    title: 'Setting up environment',
    commands: ['pnpm i', "pnpm -F '@mpa/web'^... build"]
  },
  {
    title: 'Setting up database',
    commands: ['pnpm db docker:up', 'pnpm db generate', 'pnpm db migrate', 'pnpm scripts seed']
  }
];

class TaskError extends Error {
  constructor(public cmd: string, public stderr: string) {
    super(cmd);
  }
}

type StringCommand = string;
type FnCommand<T = any> = { title: string; fn: ListrTask<T>['task'] };
type CommandGroup = { title: string; commands: Command[] };
type Command<T = any> = StringCommand | FnCommand<T> | CommandGroup;

async function createTasks<T = any>(cmds: Command<T>[]) {
  const tasks: ListrTask<T>[] = cmds.map(cmd => {
    if (typeof cmd === 'string') {
      return {
        title: cmd,
        task: async () => {
          return new Promise<void>((resolve, reject) => {
            let stderr = '';
            const cp = shell.exec(cmd, { silent: true, cwd: rootDir, async: true }).on('exit', code => {
              if (code === 0) resolve();
              else {
                reject(new TaskError(cmd, stderr));
              }
            });
            cp.stderr?.on('data', data => (stderr += data));
          });
        },
        options: {
          persistentOutput: true
        }
      };
    } else if ('fn' in cmd) {
      return {
        title: cmd.title,
        task: cmd.fn
      };
    } else {
      return {
        title: cmd.title,
        task: async (_, task) => {
          const _tasks = await createTasks(cmd.commands);
          return task.newListr(_tasks);
        }
      };
    }
  });

  return tasks;
}

const runCommands = async (cmds: Command[]) => {
  const tasks = await createTasks(cmds);
  try {
    return new Listr(tasks, { rendererOptions: { collapse: false } }).run();
  } catch (err) {
    if (err instanceof TaskError) {
      console.error(`\nCommand failed: ${err.cmd}\n`);
      console.error(err.stderr);
    } else {
      console.error(err);
    }
  }
};

async function main() {
  await runCommands(initCommands);

  const { prompt, syncLocalDbToProd } = await import('./tasks');
  const sync = await prompt({
    type: 'confirm',
    name: 'sync',
    message: 'Do you want to sync local DB to production?'
  });
  if (sync) {
    await syncLocalDbToProd();
  }
}

main();
