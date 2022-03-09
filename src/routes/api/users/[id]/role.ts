import { authMiddleware } from "$lib/auth";
import { prisma } from "$lib/prisma";
import type { Role } from "@prisma/client";

export const post = authMiddleware(
  {role:'ADMIN'},
  async ({ params, request }) => {
  const { role } = await request.json() as {role: Role};
  try {
    await prisma.user.update({
      where: {
        id: parseInt(params.id),
      },
      data: { role }
    });
    return {
      status: 200
    };
  } catch (e) {
    return {
      status: 500
    };
  }
});
