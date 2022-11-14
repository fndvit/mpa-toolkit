import chalk from 'chalk';
import { MpaDatabase, ProdSeeder } from '@mpa/db';

async function main() {
  const db = new MpaDatabase();
  const seeder = new ProdSeeder(db);
  try {
    console.log(chalk.green('Migrating seeded data...'));
    await seeder.migrate();
  } catch (e) {
    console.log(chalk.red('Error migrating seed data'));
    console.log(e);
    process.exit(1);
  } finally {
    await db.disconnect();
  }
}

main().catch(console.error);