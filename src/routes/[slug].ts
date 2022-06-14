import type { RequestHandler } from "@sveltejs/kit";
import { getPageComponentProps } from "$lib/prisma/wrappers";

export const get: RequestHandler<{slug: string}> = async ({ locals, params: { slug } }) => {
  const pageProps = await getPageComponentProps(slug, false);
  const pageId = !('error' in pageProps.body) && pageProps.body.page.id;
  if (pageId != null) locals.cacheKey = `page-${pageId}`;
  return pageProps;
};
