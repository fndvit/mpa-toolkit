import { Queries } from '@mpa/db';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async () => {
  return {
    tags: await db.prisma.tag.findMany({
      where: { type: 'TOPIC' },
      ...Queries.countTags,
      orderBy: {
        value: 'asc'
      }
    })
  };
};
