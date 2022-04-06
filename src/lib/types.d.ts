export type { Page , User, Role } from '@prisma/client';

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
  content: InlineBlock[];
}

export type CardsBlock = {
  type: 'cards';
  content: CardBlock[];
};

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
