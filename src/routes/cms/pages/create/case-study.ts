import { authMiddleware } from '$lib/auth';
import { prisma } from '$lib/prisma';

export const GET = authMiddleware({ role: 'CONTENT_MANAGER' }, async () => {
  const authors = await prisma.author.findMany();
  const allTags = await prisma.tag.findMany();
  return { body: { authors, allTags } };
});
