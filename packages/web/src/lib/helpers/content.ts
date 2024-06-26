import type {
  ContentBlock,
  ContentDocument,
  Page,
  Section,
  DiagramData,
  CardsBlock,
  LinkCardsBlock,
  CollapseBlock
} from '@mpa/db';
import { slugify } from '@mpa/utils';
import { env } from '$env/dynamic/public';

if (!env.PUBLIC_UPLOAD_BASE_URL) throw new Error('Missing PUBLIC_UPLOAD_BASE_URL');

export const staticUrl = (path: string) => (path ? `${env.PUBLIC_UPLOAD_BASE_URL}${path}` : null);

export interface ImageUrlOptions {
  width?: number;
  height?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  quality?: number;
}

const DEFAULT_IMAGE_OPTIONS: Partial<ImageUrlOptions> = { format: 'jpeg', quality: 75 };

export const imageUrl = (path: string | null, opts?: ImageUrlOptions | null) => {
  if (!path) return null;
  if (path.startsWith('data:')) return path;
  const baseUrl = /^https?:\/\//.test(path)
    ? ''
    : process.env.NODE_ENV === 'development' && path.startsWith('/src')
    ? 'http://localhost:3000'
    : env.PUBLIC_UPLOAD_BASE_URL;

  if (opts === null) return `${baseUrl}${path}`;

  const o = Object.assign({ ...DEFAULT_IMAGE_OPTIONS }, opts);
  const params = ['format', 'width', 'height', 'quality']
    .filter(key => o[key])
    .map(k => `${k}=${o[k]}`)
    .join('&');
  return `${baseUrl}${path}?${params}`;
};

export const backgroundImage = (path: string | null, opts?: ImageUrlOptions) => {
  if (!path) return null;
  return `url('${imageUrl(path, opts)}')`;
};

export function createSections(document: ContentDocument) {
  return document.content.reduce<Section[]>((sections, block, i) => {
    const isSectionHeading = block.type === 'heading' && block.attrs.level === 1;
    if (isSectionHeading || i === 0) {
      sections.push({
        id: isSectionHeading ? `h${sections.length}-${slugify(block.content[0].text)}` : null,
        title: isSectionHeading ? block.content[0].text : null,
        blocks: [block]
      });
    } else {
      sections[sections.length - 1].blocks.push(block);
    }
    return sections;
  }, []);
}

export function createEmptyPage(type: 'chapter' | 'caseStudy'): Page {
  return {
    id: null,
    title: '',
    slug: '',
    img: '',
    content: { type: 'doc' },
    draft: true,
    tags: [],
    readTime: null,
    caseStudy:
      type !== 'caseStudy'
        ? undefined
        : {
            name: '',
            established: null,
            size: null,
            governance: '',
            staff: '',
            budget: '',
            budgetLevel: '',
            lat: -90,
            long: 0,
            milestones: {},
            keyLearnings: []
          },
    chapter:
      type !== 'chapter'
        ? undefined
        : {
            summary: '',
            keyTakeaways: [],
            authors: []
          }
  };
}

export function getPageDisplayTitle(page: { title: string; caseStudy?: { name: string } }) {
  return page.caseStudy ? `${page.caseStudy.name} - ${page.title}` : page.title;
}

export function getPageTypeStr(p: Page): string {
  if (p.caseStudy) {
    const hasMilestones = p.caseStudy.milestones && Object.keys(p.caseStudy.milestones).length;
    return hasMilestones ? 'casestudy-with-milestones' : 'casestudy';
  } else if (p.chapter) return p.chapter.keyTakeaways ? 'chapter-with-key-takeaways' : 'chapter';
  throw new Error(`Unknown page type`);
}

export function createEmptyDiagram(): DiagramData {
  return {
    layers: [
      {
        card: { heading: 'Layer 1', body: 'This is the first layer' },
        image: { mobile: null, desktop: null }
      },
      {
        card: { heading: 'Layer 2', body: 'This is the second layer' },
        image: { mobile: null, desktop: null }
      }
    ],
    resources: [],
    baselayer: { desktop: null, mobile: null },
    caption: { title: 'Caption', body: 'Description' }
  };
}

export function createEmptyCard(): CardsBlock['attrs'] {
  return { style: 'default', cards: [{ heading: '', body: '' }] };
}

export function createEmptyLinkCard(): LinkCardsBlock['attrs'] {
  return { title: '', cards: [{ title: '', url: '', img: '' }] };
}

export function createEmptyCollapse(): CollapseBlock['attrs'] {
  return { showmore: '' };
}

export function getSectionSize(section: Section): number {
  // size = a proxy for visual size for inserting dynamic content
  return section.blocks.map(getBlockSize).reduce((a, b) => a + b, 0);
}

export function getBlockSize(b: ContentBlock): number {
  if (b.type === 'paragraph') {
    return b.content?.filter(c => c.text).reduce((agg, c) => agg + c.text.length, 0);
  }
  // TODO: return est sizes of other block types
  return 0;
}
