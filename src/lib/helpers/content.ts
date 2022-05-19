import type { CompletePage, ContentDocument, Section } from "../types";
import { parseTextToID } from "./utils";

export const staticUrl = (path: string) => `${import.meta.env.VITE_UPLOAD_BASE_URL}${path}`;

export function createSections(document: ContentDocument) {
  return document.content.reduce<Section[]>((acc, block) => {
    if (block.type === 'heading') {
      // new section
      acc.push({
        id: parseTextToID(block.content[0].text),
        topic: 'lorem ipsum',
        blocks: [block]
      });
    } else if(acc.length === 0) {
      acc.push({
        id: '',
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



export function createEmptyPage(type: 'chapter' | 'caseStudy'): CompletePage {
  return {
    id: null,
    title: '',
    slug: '',
    img: '',
    content: null,
    draft: true,
    tags: [],
    editedAt: null,
    createdAt: null,
    caseStudy: type !== 'caseStudy' ? undefined : {
      pageId: null,
      name: '',
      established: null,
      size: null,
      governance: '',
      staff: '',
      budget: '',
      budgetLevel: '',
      lat: null,
      long: null,
      milestones: {}
    },
    chapter: type !== 'chapter' ? undefined : {
      pageId: null,
      summary: '',
      keyTakeaways: [],
      authors: []
    },
  };
}