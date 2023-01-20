/* eslint-disable @typescript-eslint/no-explicit-any */
import * as aws from './aws';
import type { ListrTask, ListrTaskWrapper } from 'listr2';
import { Listr } from 'listr2';
import { createTask, execAsync } from './helpers';

interface MigrationRunnerTask {
  stack: aws.Stack;
  payload: aws.Payload;
  parent?: ListrTaskWrapper<any, any>;
}

type MigrationRunnerTaskCtx = { migrationRunnerArn?: string; payload?: string; dump?: aws.SqlDump };

export function createMigrationRunnerTasks({ stack, payload }: MigrationRunnerTask) {
  return [
    {
      title: 'Getting migration runner ARNs',
      task: async ctx => (ctx.migrationRunnerArn = await aws.getMigrationRunnerArn(stack.name))
    },
    {
      title: 'Invoking lambda',
      task: async ctx => {
        const response = await aws.invokeFunction(ctx.migrationRunnerArn!, payload);
        ctx.payload = response.Payload as string;

        if (ctx.payload) {
          if (payload.command === 'sql_dump') ctx.dump = JSON.parse(ctx.payload) as aws.SqlDump;
        }
      }
    }
  ] as ListrTask<MigrationRunnerTaskCtx>[];
}

export async function runMigrationRunnerCommand(title: string, opts: MigrationRunnerTask) {
  const tasks = createMigrationRunnerTasks(opts);

  try {
    await new Listr([{ title, task: async (_, task) => task.newListr(tasks) }]).run();
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
}

export const emptyLocalDb = () =>
  execAsync(
    `docker compose -p mpa exec -T -e PGPASSWORD=prisma db psql -U prisma -d mpa -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"`,
    { cwd: '../db' }
  );

export const loadDumpIntoLocal = (dump: string) =>
  execAsync(`docker compose -p mpa exec -T -e PGPASSWORD=prisma db psql -U prisma -d mpa`, {
    cwd: '../db',
    input: dump
  });

export function createDatabase({ recreate }: { recreate?: boolean } = {}): ListrTask {
  return createTask({
    title: 'Create database',
    commands: ['pnpm db docker:up' + recreate ? ' --force-recreate' : '']
  });
}

export function initDatabase({ seed }: { seed?: boolean } = {}): ListrTask {
  return createTask({
    title: 'Initialize database',
    commands: ['pnpm db generate', 'pnpm db migrate', ...(seed ? ['pnpm scripts seed'] : [])]
  });
}

export function resetLocalDbTasks(resetTo: 'empty' | 'synced' | 'seeded'): ListrTask[] {
  if (resetTo === 'empty') {
    return [{ title: 'Clean', task: emptyLocalDb }, createTask({ title: 'Migrate', cmd: 'pnpm db migrate' })];
  } else if (resetTo === 'seeded') {
    return [
      { title: 'Clean', task: emptyLocalDb },
      createTask({ title: 'Migrate', cmd: 'pnpm db migrate' }),
      createTask({ title: 'Seed', cmd: 'pnpm scripts seed' })
    ];
  } else if (resetTo === 'synced') {
    return [
      {
        title: 'Fetch production stack info',
        task: async ctx => {
          ctx.stacks = await aws.getStacks();
          const prod = ctx.stacks.environment.find(s => s.environment === 'production');
          if (!prod) throw new Error('No production stack found');
          ctx.prod = prod;
        }
      },
      {
        title: 'Dump production DB',
        task: async (ctx, task) => {
          ctx.dumpCtx = {} as MigrationRunnerTaskCtx;
          return task.newListr(
            createMigrationRunnerTasks({
              stack: ctx.prod,
              payload: { command: 'sql_dump', dumpType: 'pipe' }
            }),
            { ctx: ctx.dumpCtx }
          );
        }
      },
      { title: 'Empty local DB', task: emptyLocalDb },
      {
        title: 'Load dump',
        task: async ctx => {
          const { dump } = ctx.dumpCtx as MigrationRunnerTaskCtx;
          if (!dump || !('output' in dump)) throw new Error('No dump returned');
          return loadDumpIntoLocal(dump.output);
        }
      }
    ];
  } else {
    throw new Error(`Unknown resetTo: ${resetTo}`);
  }
}
