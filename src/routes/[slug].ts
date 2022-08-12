import type { RequestHandler } from '@sveltejs/kit';
import { getPageComponentProps } from '$lib/prisma/wrappers';

export const GET: RequestHandler<{ slug: string }> = async ({ locals, params: { slug } }) => {
  const pageProps = await getPageComponentProps(slug, false);

  if ('error' in pageProps.body) return pageProps;

  const pageId = pageProps.body.page.id;
  const pageTags = pageProps.body.page.tags;

  locals.cacheKeys.add(`page-${pageId}`);
  pageTags.forEach(tag => locals.cacheKeys.add(`tag-${tag.tag.id}`));

  return pageProps;
};
