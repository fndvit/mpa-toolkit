import chalk from 'chalk';
import { DevSeeder, initDatabase } from '@mpa/db';

async function main() {
  const db = initDatabase();
  const seeder = new DevSeeder(db);
  try {
    console.log(chalk.green('Seeding database...'));
    await seeder.seed();
  } catch (e) {
    console.log(chalk.red('Error seeding database:'));
    console.log(e);
    process.exit(1);
  } finally {
    await db.disconnect();
  }
}

main().catch(console.error);
