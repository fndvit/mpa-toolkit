import { authMiddleware } from '$lib/auth';

export const GET = authMiddleware({ role: 'CONTENT_MANAGER' }, async () => {
  return { body: {} };
});
