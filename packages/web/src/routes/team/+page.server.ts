import { marked } from 'marked';
import type { PageServerLoad } from './$types';
import team from '$lib/about/team.md?raw';

export const load: PageServerLoad = async () => {
  const content = marked.parse(team);
  return { content };
};
