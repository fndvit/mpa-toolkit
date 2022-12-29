import chapterDefaultImage from '$lib/assets/chapter-default-image.jpg';
import type { PageData as PageDataArticle } from '../routes/[slug]/$types';
import type { PageData as PageDataTag } from '../routes/tag/[slug]/$types';
import type { PageData as PageDataSearch } from '../routes/search/$types';
import type { PageData as PageDataAuthor } from '../routes/author/[slug]/$types';
import type { PageData as PageDataCmsPage } from '../routes/cms/pages/[id]/$types';
import type { PageData as PageDataDraft } from '../routes/draft/[slug]/$types';
import { getPageDisplayTitle } from './helpers/content';

export interface IndexedPageMetadata {
  title: string;
  desc: string;
  type: 'WebSite' | 'Article';
  image: string;
  indexed?: true;
}

export interface UnindexedPageMetadata {
  title: string;
  indexed: false;
}

export type PageMetadata = IndexedPageMetadata | UnindexedPageMetadata;

export const getPageMetadata = (route: string, data?: unknown): PageMetadata => {
  const config = METADATA[route];
  if (!config) return null;

  if (typeof config === 'function') {
    return data === undefined ? undefined : config(data);
  } else {
    return config;
  }
};

export type IndexedPageMetadataConfig = IndexedPageMetadata | ((data: unknown) => IndexedPageMetadata);

export type UnindexedPageMetadataConfig = UnindexedPageMetadata | ((data: unknown) => UnindexedPageMetadata);

export type PageMetadataConfig = IndexedPageMetadataConfig | UnindexedPageMetadataConfig;

export const METADATA: Record<string, PageMetadataConfig> = {
  /**
   * INDEXED ROUTES
   */
  '/': {
    title: 'MPAth - Marine solutions hub',
    desc: 'A brand-new, growing educational platform for the MPA community to share lessons, challenges and sustainable solutions.',
    type: 'WebSite',
    image: chapterDefaultImage
  },
  '/[slug]': (data: PageDataArticle) => ({
    title: data.page ? getPageDisplayTitle(data.page) : '',
    desc: data.page?.chapter?.summary || data.page?.caseStudy?.name || 'Untitled',
    type: 'Article',
    image: chapterDefaultImage
  }),
  '/tag/[slug]': (data: PageDataTag) => ({
    title: data.tag?.value,
    desc: '',
    type: 'WebSite',
    image: chapterDefaultImage
  }),
  '/search': (data: PageDataSearch) => ({
    title: `"${data.search}"`,
    desc: '',
    type: 'WebSite',
    image: chapterDefaultImage
  }),
  '/author/[slug]': (data: PageDataAuthor) => ({
    title: data.title,
    desc: '',
    type: 'WebSite',
    image: chapterDefaultImage
  }),
  '/recommended/[slug]': {
    title: 'Recommended for you',
    desc: '',
    type: 'WebSite',
    image: chapterDefaultImage
  },
  '/team': {
    title: 'MPAth team',
    desc: '',
    type: 'WebSite',
    image: chapterDefaultImage
  },
  '/partners': {
    title: 'MPAth partners',
    desc: '',
    type: 'WebSite',
    image: chapterDefaultImage
  },
  '/privacy-policy': {
    title: `MPAth privacy policy`,
    desc: '',
    type: 'WebSite',
    image: chapterDefaultImage
  },
  '/terms-of-use': {
    title: `MPAth terms of use`,
    desc: '',
    type: 'WebSite',
    image: chapterDefaultImage
  },
  '/sitemap': {
    title: `MPAth sitemap`,
    desc: '',
    type: 'WebSite',
    image: chapterDefaultImage
  },

  /**
   * UNINDEXED ROUTES
   */

  '/cms': {
    indexed: false,
    title: 'CMS'
  },
  '/cms/login': {
    indexed: false,
    title: 'Login'
  },
  '/cms/dump': {
    indexed: false,
    title: 'CMS - Dump'
  },
  '/cms/pages': {
    indexed: false,
    title: 'CMS - Pages'
  },
  '/cms/tags': {
    indexed: false,
    title: 'CMS - Tags'
  },
  '/cms/users': {
    indexed: false,
    title: 'CMS - Users'
  },
  '/cms/authors': {
    indexed: false,
    title: 'CMS - Authors'
  },
  '/cms/homepage': {
    indexed: false,
    title: 'CMS - Homepage'
  },
  '/cms/pages/[id]': (data: PageDataCmsPage) => ({
    indexed: false,
    title: data.page ? `Edit page - ${getPageDisplayTitle(data.page)}` : 'Edit page'
  }),
  '/cms/pages/create/chapter': {
    indexed: false,
    title: 'New chapter'
  },
  '/cms/pages/create/case-study': {
    indexed: false,
    title: 'New case study'
  },
  '/draft/[slug]': (data: PageDataDraft) => ({
    indexed: false,
    title: `[DRAFT] ${data.page ? getPageDisplayTitle(data.page) : ''}`
  })
};
