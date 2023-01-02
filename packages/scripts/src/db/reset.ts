import chalk from 'chalk';
import { initDatabase, reset } from '@mpa/db';

const log = console.log;

async function main() {
  const db = initDatabase();

  log(chalk.green('Resetting database...'));
  try {
    await reset(db.prisma);
  } catch (e) {
    log(chalk.red('Error resetting database:'));
    log(e);
    process.exit(1);
  } finally {
    await db.disconnect();
  }
}

main().catch(console.error);
