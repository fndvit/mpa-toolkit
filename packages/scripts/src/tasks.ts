import { exec, type ExecOptions } from 'child_process';
import projectRoot from '@mpa/utils/projectRoot';
import * as aws from './aws';
import type { ListrRenderer, ListrTask, ListrTaskWrapper } from 'listr2';
import { Listr } from 'listr2';
import prompts from 'prompts';

export async function runSingleTask<T>(
  title: string,
  fn: (task?: ListrTaskWrapper<{ response: T }, typeof ListrRenderer>) => Promise<T>
): Promise<T> {
  return new Listr<{ response: T }>({ title, task: async (ctx, task) => (ctx.response = await fn()) })
    .run()
    .then(ctx => ctx.response);
}

export async function prompt<T>(p: prompts.PromptObject): Promise<T> {
  return prompts(p, { onCancel: () => process.exit(0) }).then(r => r[p.name as string] as T);
}

async function execAsync(cmd: string, opts: ExecOptions & { input?: string } = {}) {
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

interface MigrationRunnerCommand {
  stack: aws.Stack;
  payload: aws.Payload;
}

export async function runMigrationRunnerCommand({ stack, payload }: MigrationRunnerCommand) {
  const tasks: ListrTask<{ migrationRunnerArn?: string }>[] = [
    {
      title: 'Getting migration runner ARNs',
      task: async ctx => (ctx.migrationRunnerArn = await aws.getMigrationRunnerArn(stack.name))
    },
    {
      title: 'Invoking lambda',
      task: async (ctx, task) => {
        const response = await aws.invokeFunction(ctx.migrationRunnerArn!, payload);
        task.output = response.Payload as string;
      }
    }
  ];

  const listr = new Listr(tasks);

  try {
    await listr.run();
  } catch (err) {
    console.log('');
    if (err instanceof aws.InvocationError) {
      console.error('Invocation error');
      console.error(err.trace || err.message);
      console.error(err);
    } else {
      console.error(err);
    }
  }

  const output = listr.tasks.find(t => t.title === 'Invoking lambda')?.output;
  if (!output) return;
  if (payload.command === 'sql_dump') return JSON.parse(output) as aws.SqlDump;
}

export async function syncLocalDbToProd() {
  const stacks = await runSingleTask('Getting stacks', aws.getStacks);
  const prod = stacks.environment.find(s => s.environment === 'production');
  if (!prod) throw new Error('No production stack found');
  const dump = await runMigrationRunnerCommand({ stack: prod, payload: { command: 'sql_dump', dumpType: 'pipe' } });
  if (!dump || !('output' in dump)) throw new Error('No dump returned');

  await runSingleTask('Clear local DB', async () =>
    execAsync(
      `docker compose -p mpa exec -T -e PGPASSWORD=prisma db psql -U prisma -d mpa -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"`,
      { cwd: projectRoot('packages/db') }
    )
  );

  await runSingleTask('Load dump', async () =>
    execAsync(`docker compose -p mpa exec -T -e PGPASSWORD=prisma db psql -U prisma -d mpa`, {
      cwd: projectRoot('packages/db'),
      input: dump.output
    })
  );
}
