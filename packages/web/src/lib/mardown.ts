import { marked } from 'marked';
import yamlFront from 'yaml-front-matter';

export function parseMd(md: string) {
  const { __content, ...metadata } = yamlFront.loadFront(md);
  const html = marked.parse(__content);
  return { html, metadata };
}
