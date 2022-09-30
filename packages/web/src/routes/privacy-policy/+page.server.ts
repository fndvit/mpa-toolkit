import { marked } from 'marked';
import type { PageServerLoad } from './$types';
import privacyPolicy from '$lib/about/privacyPolicy.md?raw';

export const load: PageServerLoad = async ({ locals }) => {
  let content = marked.parse(privacyPolicy);
  let lastUpdated = content.split("</p>\n").shift();
  content = content.replace(lastUpdated, '').replace("</p>\n", '');
  lastUpdated = lastUpdated.replace("<p>",'');
  return {content, lastUpdated};
};