import { authMiddleware } from '$lib/auth';
import { deletePage, updatePage } from '$lib/prisma/wrappers';
import type { PageRequest } from '$lib/types';

export const PATCH = authMiddleware({ role: 'CONTENT_MANAGER' }, async ({ request, params }) => {
  const body = (await request.json()) as PageRequest;

  const page = await updatePage(parseInt(params.id), body);

  return {
    status: 200,
    body: page
  };
});

export const DELETE = authMiddleware({ role: 'CONTENT_MANAGER' }, async ({ params }) => {
  const pageId = parseInt(params.id);

  await deletePage(pageId);

  return {
    status: 200
  };
});
