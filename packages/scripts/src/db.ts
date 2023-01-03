import * as aws from './lib/aws';
import ago from 's-ago';
import { blue, magenta } from 'colorette';
import { runMigrationRunnerCommand, resetLocalDbTasks } from './lib/tasks';
import type { ListrTask } from 'listr2';
import { Listr } from 'listr2';
import { prompt, runSingleTask } from './lib/helpers';

async function getDumps(sharedStackName: string) {
  const tasks: ListrTask<{ adminBucket: string; dumps: aws.Dump[] }>[] = [
    {
      title: 'Getting admin bucket',
      task: async ctx => (ctx.adminBucket = await aws.getAdminBucket(sharedStackName))
    },
    {
      title: 'Getting dumps',
      task: async ctx => (ctx.dumps = await aws.getDumps(ctx.adminBucket!))
    }
  ];

  return new Listr(tasks).run().then(ctx => ctx.dumps);
}

const promptCommand = () =>
  prompt<'deploy' | 'seed' | 'sql_dump' | 'sql_load' | 'reset'>({
    type: 'select',
    name: 'cmd',
    message: 'Select a command',
    choices: [
      { title: 'Reset local DB', description: 'Clean / reset / sync local database', value: 'reset' },
      { title: 'Migrate', description: 'Update database schema with any changes', value: 'deploy' },
      { title: 'Seed', description: 'Seed/sync initial data (e.g. fixed tags)', value: 'seed' },
      { title: 'Dump SQL', description: 'Dump SQL from prod/staging to S3', value: 'sql_dump' },
      { title: 'Load SQL', description: 'Load a SQL dump from S3 to prod/staging', value: 'sql_load' }
    ]
  });

const promptStack = (stacks: aws.Stack[]) =>
  prompt<aws.Stack>({
    type: 'select',
    name: 'stack',
    message: 'Which environment?',
    choices: stacks.map(s => ({
      title: s.environment,
      description: s.name,
      value: s
    }))
  });

const promptDumps = async (sharedStackName: string) => {
  const dumps = await getDumps(sharedStackName);
  return prompt<string>({
    type: 'select',
    name: 'dumpKey',
    choices: dumps
      .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
      .map(d => {
        return {
          title: `${d.key.match(/\/(?<name>[^/]+)-[0-9TZ]+\.sql$/)?.groups?.name || d.key} (${ago(d.lastModified)})`,
          value: d.key,
          description: d.lastModified.toISOString()
        };
      }),
    message: 'Choose a dump file to load'
  });
};

async function main() {
  const cmd = await promptCommand();

  if (cmd === 'reset') {
    const resetType = await prompt<'empty' | 'seeded' | 'synced'>({
      type: 'select',
      name: 'empty',
      message: 'What state do you want to reset to?',
      choices: [
        { title: 'Seeded', description: 'Seed with base tags', value: 'seeded' },
        { title: 'Sync', description: 'Sync to production', value: 'synced' },
        { title: 'Empty', description: 'Leave empty after reset', value: 'empty' }
      ]
    });

    await runSingleTask('Resetting database', async task => task?.newListr(resetLocalDbTasks(resetType)));
  } else if (/^(deploy|seed|sql_dump|sql_load)$/.test(cmd)) {
    const stacks = await runSingleTask('Getting stacks', aws.getStacks);
    const stack = await promptStack(stacks.environment);

    if (cmd === 'seed' || cmd === 'deploy') {
      return runMigrationRunnerCommand(
        cmd === 'seed' ? `Seeding ${stack.environment}` : `Migrating ${stack.environment}`,
        { stack: stack, payload: { command: cmd } }
      );
    } else if (cmd === 'sql_dump') {
      return runMigrationRunnerCommand(`Dumping SQL from ${stack.environment}`, {
        stack: stack,
        payload: { command: 'sql_dump', dumpType: 'manual' }
      });
    } else if (cmd === 'sql_load') {
      const dumpKey = await promptDumps(stacks.shared.name);
      const confirm = await prompt({
        type: 'confirm',
        name: 'confirm',
        message:
          `This will wipe the ${magenta(stack.environment.toUpperCase())} database and ` +
          `load the selected dump: ${blue(dumpKey)}. Are you sure?`
      });

      if (!confirm) return console.log('Aborted');
      if (!dumpKey) return console.log('No dump file selected');

      return runMigrationRunnerCommand(`Loading SQL dump into ${stack.environment}`, {
        stack: stack,
        payload: { command: 'sql_load', dumpKey }
      });
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
