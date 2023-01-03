import type { Command } from './lib/helpers';
import { runSingleTask, prompt, runCommands } from './lib/helpers';

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

async function main() {
  await runCommands(initCommands);

  const sync = await prompt({
    type: 'confirm',
    name: 'sync',
    message: 'Do you want to sync local DB to production?'
  });
  if (sync) {
    const { resetLocalDbTasks } = await import('./lib/tasks');
    await runSingleTask('Resetting database', async task => task?.newListr(resetLocalDbTasks('synced')));
  }
}

main();
