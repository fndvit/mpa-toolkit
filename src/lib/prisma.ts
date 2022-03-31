import env from "./env";
import PrismaClientPkg from "@prisma/client";

const { PrismaClient } = PrismaClientPkg;

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.databaseUrl
    }
  }
});
