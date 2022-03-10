export type { Page , User, Role } from '@prisma/client';

export interface Locals {
	userid: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
}

export type HTMLBlock<T extends string> = {
  type: T,
  html: string;
  text: string;
}

export type HeadingBlock = HTMLBlock<'heading'>;
export type ParagraphBlock = HTMLBlock<'paragraph'>;

export type CardsBlock = {
  type: 'cards';
  node: any;
}

export type ContentBlock = HeadingBlock | ParagraphBlock | CardsBlock;
