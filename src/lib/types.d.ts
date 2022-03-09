export type { Page , User, Role } from '@prisma/client';

export interface Locals {
	userid: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
}

export type PageHTMLContent = {
  type: 'html',
  value: string;
}

export type PageContent = PageHTMLContent;
