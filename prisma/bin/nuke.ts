import chalk from 'chalk';
import { prisma } from '../../src/lib/prisma';
import { reset } from '../lib/reset';
import { seed } from '../lib/seed';

async function main() {
  console.log(chalk.green('Resetting database...'));
  try {
    await reset();
  } catch (e) {
    console.log(chalk.red('Error resetting database:'));
    console.log(e);
    process.exit(1);
  }

  console.log(chalk.green('Seeding database...'));
  try {
    await seed(true);
  } catch (e) {
    console.log(chalk.red('Error seeding database:'));
    console.log(e);
    process.exit(1);
  }
}

main()
  .catch(console.error)
  .finally(async () => prisma.$disconnect());
