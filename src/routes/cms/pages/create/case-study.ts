import { authMiddleware } from "$lib/auth";
import { prisma } from "$lib/prisma";


export const get = authMiddleware(
  { role: 'CONTENT_MANAGER' },
  async () => {
    const users = await prisma.user.findMany();
    const allTags = await prisma.tag.findMany();
    return { body: { users, allTags } };
  }
);
