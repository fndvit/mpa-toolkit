import chalk from 'chalk';
import { MpaDatabase } from '../db';
import { env } from '../env';
import '../lib/cli';
import { Seeder } from '../lib/seed';

async function main() {
  const db = new MpaDatabase(env.DATABASE_URL);
  const seeder = new Seeder(db);
  try {
    console.log(chalk.green('Seeding database...'));
    await seeder.seed(true);
  } catch (e) {
    console.log(chalk.red('Error seeding database:'));
    console.log(e);
    process.exit(1);
  } finally {
    await db.disconnect();
  }
}

main().catch(console.error);
