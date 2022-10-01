import { marked } from 'marked';
import type { PageServerLoad } from './$types';
import privacy from '$lib/about/privacy.md?raw';

export const load: PageServerLoad = async () => {
  let content = marked.parse(privacy);
  let lastUpdated = content.split('</p>\n').shift();
  content = content.replace(lastUpdated, '').replace('</p>\n', '');
  lastUpdated = lastUpdated.replace('<p>', '');
  return { content, lastUpdated };
};
