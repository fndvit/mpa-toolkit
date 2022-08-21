import { db } from '$lib/db';

export const load = async () => {
  const authors = await db.prisma.author.findMany();
  const allTags = await db.prisma.tag.findMany();
  return { authors, allTags };
};
