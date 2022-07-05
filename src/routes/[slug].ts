import type { RequestHandler } from "@sveltejs/kit";
import { getPageComponentProps } from "$lib/prisma/wrappers";

export const get: RequestHandler<{slug: string}> = async ({ locals, params: { slug } }) => {
  const pageProps = await getPageComponentProps(slug, false);
  const pageId = !('error' in pageProps.body) && pageProps.body.page.id;
  const pageTags = !('error' in pageProps.body) && pageProps.body.page.tags;
  
  locals.cacheKey ??= new Set();
  
  if (pageId != null) locals.cacheKey.add(`page-${pageId}`);
  if (pageTags != null) pageTags?.forEach(tag => locals.cacheKey?.add(`tag-${tag.tag.id}`));

  console.log('Page Props:', pageProps);
  return pageProps;
};
