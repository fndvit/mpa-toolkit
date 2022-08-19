import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async () => {
  return {
    users: await db.prisma.user.findMany({
      orderBy: [{ role: 'desc' }, { id: 'asc' }]
    })
  };
};
