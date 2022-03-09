import { authMiddleware } from "$lib/auth";
import { prisma } from "$lib/prisma";
import { requestToPrismaParams } from "./[id]";

export const put = authMiddleware(
  { role:'CONTENT_MANAGER' },
  async ({ request }) => {

    const params = await requestToPrismaParams(request);

    const page = await prisma.page.create({ data: params });

    return {
      status: 200,
      body: page
    };

  }
);
