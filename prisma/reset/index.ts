import { prisma } from '../../src/lib/prisma';
import { reset } from "./reset";

reset()
  .catch(console.error)
  .finally(async () => prisma.$disconnect());
