import { prisma } from "../../src/lib/prisma";
import { seed } from "./seed";

// async function main() {
// }
seed(true)
  .catch(console.error)
  .finally(async () => prisma.$disconnect());

// export async function prod() {
//   return run(false);

// }
// export async function dev() {
//   return run(true);
// }
