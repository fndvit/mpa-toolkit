import type { PageServerLoad } from './$types';
import terms from '$lib/about/terms.md?raw';
import { parseMd } from '$lib/mardown';

export const load: PageServerLoad = async () => {
  const { html, metadata } = parseMd(terms);
  return { content: html, lastUpdated: metadata.updated };
};
