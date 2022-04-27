import type { ContentDocument, Section } from "./types";

export const staticUrl = (path: string) => `${import.meta.env.VITE_UPLOAD_BASE_URL}${path}`;

export const parseTextToID = (text: string) => text.replace(/\s|\./g, '');

export function createSections(document: ContentDocument) {
  return document.content.reduce<Section[]>((acc, block) => {
    if (block.type === 'heading') {
      // new section
      acc.push({
        id: parseTextToID(block.content[0].text),
        topic: 'lorem ipsum',
        blocks: [block]
      });
    } else {
      // add to current section
      acc[acc.length - 1].blocks.push(block);
    }
    return acc;
  }, []);
}