import type { TagRequest } from '$lib/types';
import { authMiddleware } from '$lib/auth';
import { createTag } from '$lib/prisma/wrappers';

export const PUT = authMiddleware({ role: 'CONTENT_MANAGER' }, async ({ request }) => {
  const body = (await request.json()) as TagRequest;

  const tag = await createTag(body);

  return {
    status: 200,
    body: tag
  };
});
