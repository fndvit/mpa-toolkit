import chalk from 'chalk';
import { type MpaDatabase, DevSeeder, reset, initDatabase } from '@mpa/db';

const log = console.log;

async function nuke(db: MpaDatabase) {
  log(chalk.green('Resetting database...'));
  try {
    await reset(db.prisma);
  } catch (e) {
    log(chalk.red('Error resetting database:'));
    log(e);
    process.exit(1);
  }

  const seeder = new DevSeeder(db);
  log(chalk.green('Seeding database...'));
  try {
    await seeder.seed();
  } catch (e) {
    log(chalk.red('Error seeding database:'));
    log(e);
    process.exit(1);
  }
}

async function main() {
  const db = initDatabase();
  try {
    await nuke(db);
  } finally {
    await db.disconnect();
  }
}

main().catch(console.error);
