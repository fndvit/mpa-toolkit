import { authMiddleware } from "$lib/auth";
import { deleteTag, updateTag } from "$lib/prisma/wrappers";
import type { TagRequest } from "$lib/types";

export const patch = authMiddleware(
  { role:'CONTENT_MANAGER' },
  async ({ request, params }) => {

    const body = await request.json() as TagRequest;

    const tag = await updateTag(parseInt(params.id), body);

    return {
      status: 200,
      body: tag
    };

  }
);

export const del = authMiddleware(
  { role:'CONTENT_MANAGER' },
  async ({ params }) => {

    const tagId = parseInt(params.id);

    await deleteTag(tagId);

    return {
      status: 200
    };
  }
);
