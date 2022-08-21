import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async () => {
  const authors = await db.prisma.author.findMany();
  const allTags = await db.prisma.tag.findMany();
  return { authors, allTags };
};
