import type { PageRequest } from "$lib/types";
import { authMiddleware } from "$lib/auth";
import { createPage } from "$lib/prisma/wrappers";

export const put = authMiddleware(
  { role:'CONTENT_MANAGER' },
  async ({ request }) => {

    const body = await request.json() as PageRequest;

    const page = await createPage(body);

    return {
      status: 200,
      body: page
    };

  }
);
