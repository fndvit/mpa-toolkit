import chalk from 'chalk';
import { prisma } from '../../src/lib/prisma';
import { reset } from "../lib/reset";
import { seed } from "../lib/seed";

async function main() {

  console.log(chalk.green('Resetting database...'));
  await reset();

  console.log(chalk.green('Seeding database...'));
  await seed(true);
}

main()
  .catch(console.error)
  .finally(async () => prisma.$disconnect());
