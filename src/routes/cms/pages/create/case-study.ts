import { authMiddleware } from "$lib/auth";
import { prisma } from "$lib/prisma";
import { userBasic } from "$lib/prisma/queries";


export const get = authMiddleware(
  { role: 'CONTENT_MANAGER' },
  async () => {
    const users = await prisma.user.findMany(userBasic);
    const allTags = await prisma.tag.findMany();
    return { body: { users, allTags } };
  }
);
