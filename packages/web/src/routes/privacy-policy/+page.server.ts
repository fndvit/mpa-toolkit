import type { PageServerLoad } from './$types';
import privacy from '$lib/about/privacy.md?raw';
import { parseMd } from '$lib/mardown';

export const load: PageServerLoad = async () => {
  const { html, metadata } = parseMd(privacy);
  return { content: html, lastUpdated: metadata.updated };
};
