import { prisma } from '../../src/lib/prisma';
import { reset as _reset } from "../lib/reset";

_reset()
  .catch(console.error)
  .finally(async () => prisma.$disconnect());
