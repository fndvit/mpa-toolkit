import type { CompletePage, ContentDocument, Section } from "../types";
import { slugify } from "./utils";

export const staticUrl = (path: string) => `${import.meta.env.VITE_UPLOAD_BASE_URL}${path}`;

export function createSections(document: ContentDocument) {
  return document.content.reduce<Section[]>((sections, block, i) => {
    const isHeading = block.type === 'heading';
    if (isHeading || i === 0) {
      sections.push({
        id: isHeading
          ? `h${sections.length}-${slugify(block.content[0].text)}`
          : null,
        title: isHeading ? block.content[0].text : null,
        topic: 'lorem ipsum',
        blocks: [block]
      });
    } else {
      sections[sections.length - 1].blocks.push(block);
    }
    return sections;
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
    readTime: null,
    caseStudy: type !== 'caseStudy' ? undefined : {
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
      summary: '',
      keyTakeaways: [],
      authors: []
    },
  };
}
