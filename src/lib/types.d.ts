import type { Page, User, Role, CaseStudy, Chapter } from '@prisma/client';
export type * from '@prisma/client';

export interface Locals {
	userid: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
}

export interface Tag {
  id: string;
  value: string;
  typeId: number;
}

export interface TagInfo {
  category: Category;
  tag: Tag;
  typeId: number;
  alt: string;
}

export interface Category {
  id: number;
  category: string;
}

export interface TagOnPages {
  pageId: string;
  tagId: string;
  categoryId: string;
}

export type CompletePage = Page & {
  caseStudy: CaseStudy;
  chapter: Chapter & {
    authors: User[];
  };
  tags: TagOnPages;
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
