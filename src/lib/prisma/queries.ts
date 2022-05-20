import type { Modify } from "$lib/helpers/utils";
import type { ContentDocument, MilestonesData } from "$lib/types";
import { Prisma, TagType } from "@prisma/client";

export const pageTag = {
  select: {
    tag: {
      select: {
        id: true,
        value: true,
        type: true,
      }
    },
    category: true
  }
};

export const pageForCollectionPage = {
  select: {
    title: true,
    slug: true,
    img: true,
    readTime: true,
    tags: {
      ...pageTag,
      where: { tag: { type: TagType.TOPIC } },
    },
    chapter: {
      select: {
        authors: {
          select: { name: true }
        }
      }
    },
  }
};

export const chapterForPageMeta = {
  select: {
    keyTakeaways: true,
    summary: true,
    authors: {
      select: {
        id: true,
        name: true,
        img: true
      }
    }
  }
};

export const caseStudyForPageMeta = {
  select: {
    name: true,
    established: true,
    size: true,
    governance: true,
    staff: true,
    budget: true,
    budgetLevel: true,
    lat: true,
    long: true,
    milestones: true,
  }
};

export const page = {
  select: {
    id: true,
    slug: true,
    draft: true,
    title: true,
    img: true,
    content: true,
    readTime: true,
    tags: pageTag,
    chapter: chapterForPageMeta,
    caseStudy: caseStudyForPageMeta,
  }
};

export const pageForContentCard = {
  select: {
    tags: pageTag,
    title: true,
    img: true,
    slug: true
  }
};

export type PageTag = Prisma.TagsOnPagesGetPayload<typeof pageTag>;
export type CollectionCard = Prisma.PageGetPayload<typeof pageForCollectionPage>;
export type ChapterMeta = Prisma.ChapterGetPayload<typeof chapterForPageMeta>;
type _CaseStudyMeta = Prisma.CaseStudyGetPayload<typeof caseStudyForPageMeta>;
export type CaseStudyMeta = Modify<_CaseStudyMeta, { milestones: MilestonesData }>
export type Page = Modify<Prisma.PageGetPayload<typeof page>, {
  caseStudy?: CaseStudyMeta, chapter?: ChapterMeta, content: ContentDocument
}>;
export type ContentCard = Prisma.PageGetPayload<typeof pageForContentCard>;
