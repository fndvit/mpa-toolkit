import type { Page, User, Role, CaseStudy } from '@prisma/client';
export type * from '@prisma/client';

export interface Locals {
	userid: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
}

export type CompletePage = Page & {
  caseStudy: CaseStudy;
  chapter: Chapter & {
    authors: User[];
  };
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

export type ExpandSectionBlock = {
  type: 'expand',
  content: {
    ID: number,
    section: string,
    interaction: (ExpandButtonID: number, show: boolean) => void
  }
}

export type MadLibBlock = {
  type: 'madlib';
}

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

export type ContentBlock = HeadingBlock | ParagraphBlock | CardsBlock | MadLibBlock | ExpandSectionBlock;

export type ContentDocument = {
  type: 'doc';
  content: ContentBlock[];
}
