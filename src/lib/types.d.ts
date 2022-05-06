import type { Tag, Page, User, CaseStudy, Chapter, TagCategory, Role } from '@prisma/client';
export type * from '@prisma/client';

export interface Locals {
	userid: string;
}

export interface UserInfo {
  id: number;
  email: string;
  name: string;
}

export interface PageTag {
  tag: Tag;
  category: TagCategory
}

export type CompletePage = Page & {
  caseStudy: CaseStudy;
  chapter: Chapter & {
    authors: User[];
  };
  tags: PageTag[];
}

// *******************
// API REQUEST BODIES
// *******************

export type UserRequest = {
  role?: Role;
  img?: string;
}

export type PageRequest = {

  title: string;
  slug: string;
  content: object;
  img: string;
  tags: {
    tag: { id: number };
    category: TagCategory
  }[];
  caseStudy?: Omit<CaseStudy, 'pageId'>;
  chapter?: {
    summary: string;
    authors: number[];
    keyTakeaways: string[];
  }
}

// **********************
//  TOP LEVEL COMPONENTS
// **********************

export type HeadingBlock = {
  type: 'heading';
  attrs: {
    level: number;
  };
  content: InlineBlock[];
}

export type ParagraphBlock = {
  type: 'paragraph';
  content?: InlineBlock[];
}

export type CardsBlock = {
  type: 'cards';
  content: CardBlock[];
};

export type ImageBlock = {
  type: 'image';
  attrs: {
    src: string;
    alt?: string;
    title?: string;
  };
}

// *******************
//  NESTED COMPONENTS
// *******************

export type CardBlock = {
  type: 'card';
  content: [CardHeadingBlock, CardBodyBlock];
}

export type CardHeadingBlock = {
  type: 'cardheading';
  content: InlineBlock[];
}

export type CardBodyBlock = {
  type: 'cardbody';
  content: InlineBlock[];
}

export type Mark = {
  type: 'strong' | 'em' | 'underline';
}

export type TextBlock = {
  type: 'text';
  text: string;
  marks?: Mark[];
}

export type InlineBlock = TextBlock;

export type ContentBlock = HeadingBlock | ParagraphBlock | CardsBlock;

export type ContentDocument = {
  type: 'doc';
  content: ContentBlock[];
}

export type Section = {
  id: string;
  topic: string;
  blocks: ContentBlock[];
};
