import { prisma } from "../../src/lib/prisma";
import { seed as _seed } from "../lib/seed";

_seed(true)
  .catch(console.error)
  .finally(async () => prisma.$disconnect());
