import { authMiddleware } from "$lib/auth";
import { getPageComponentProps } from "$lib/prisma/wrappers";

export const get = authMiddleware(
  { role: 'CONTENT_MANAGER' },
  async ({ params: { slug } }) => {
  return getPageComponentProps(slug, true);
});
