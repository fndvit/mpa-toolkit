import { authMiddleware } from "$lib/auth";
import { prisma } from "$lib/prisma";

export const get = authMiddleware(
  { role: 'CONTENT_MANAGER' },
  async () => {
    return {
      body: {
        tags: await prisma.tag.findMany({
          where: { type: "TOPIC" },
          include: {
            _count: {
              select: {
                pageTags: true
              }
            }
          },
          orderBy: {
            value: 'asc'
          }
        })
      }
    };
  });
