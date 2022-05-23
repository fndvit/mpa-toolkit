import { prisma } from "../../src/lib/prisma";
import { seed } from "./seed";

seed(true)
  .catch(console.error)
  .finally(async () => prisma.$disconnect());
