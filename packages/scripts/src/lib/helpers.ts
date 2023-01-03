/* eslint-disable @typescript-eslint/no-explicit-any */
import { exec, type ExecOptions } from 'child_process';
import type { ListrRenderer, ListrTask, ListrTaskWrapper } from 'listr2';
import shell from 'shelljs';
import { Listr } from 'listr2';
import prompts from 'prompts';

const rootDir = '../..';

class TaskError extends Error {
  constructor(public cmd: string, public stderr: string) {
    super(cmd);
  }
}

export type StringCommand = string;
export type ShellCommand<T = any> = { title: string; cmd: string };
export type FnCommand<T = any> = { title: string; fn: ListrTask<T>['task'] };
export type CommandGroup = { title: string; commands: Command[] };
export type Command<T = any> = StringCommand | FnCommand<T> | CommandGroup | ShellCommand;

export function createTask<T>(cmd: Command<T>): ListrTask {
  if (typeof cmd === 'string') {
    return createTask({ title: cmd, cmd });
  } else if ('fn' in cmd) {
    return { title: cmd.title, task: async (ctx, task) => (ctx.response = await cmd.fn(ctx, task)) };
  } else if ('cmd' in cmd) {
    return {
      title: cmd.title,
      task: async () => {
        return new Promise<void>((resolve, reject) => {
          let stderr = '';
          const cp = shell.exec(cmd.cmd, { silent: true, cwd: rootDir, async: true }).on('exit', code => {
            if (code === 0) resolve();
            else {
              reject(new TaskError(cmd.cmd, stderr));
            }
          });
          cp.stderr?.on('data', data => (stderr += data));
        });
      },
      options: {
        persistentOutput: true
      }
    };
  } else {
    return {
      title: cmd.title,
      task: async (_, task) => {
        return task.newListr(cmd.commands.map(createTask));
      }
    };
  }
}

export const runCommands = async (cmds: Command[]) => {
  try {
    return new Listr(cmds.map(createTask), { rendererOptions: { collapse: false } }).run();
  } catch (err) {
    if (err instanceof TaskError) {
      console.error(`\nCommand failed: ${err.cmd}\n`);
      console.error(err.stderr);
    } else {
      console.error(err);
    }
  }
};

export async function runSingleTask<T>(
  title: string,
  fn: (task?: ListrTaskWrapper<{ response: T }, typeof ListrRenderer>) => Promise<T>
): Promise<T> {
  return new Listr<{ response: T }>(createTask<{ response: T }>({ title, fn: (_, task) => fn(task) }))
    .run()
    .then(ctx => ctx.response);
}

export async function prompt<T>(p: prompts.PromptObject): Promise<T> {
  return prompts(p, { onCancel: () => process.exit(0) }).then(r => r[p.name as string] as T);
}

export async function execAsync(cmd: string, opts: ExecOptions & { input?: string } = {}) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    const child = exec(cmd, opts, (err, stdout, stderr) => {
      if (err) reject(err);
      else resolve({ stdout, stderr });
    });
    if (opts.input && child.stdin) {
      child.stdin.write(opts.input);
      child.stdin.end();
    }
    child.on('error', reject);
  });
}
