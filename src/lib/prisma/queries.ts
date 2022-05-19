import type { Prisma } from "@prisma/client";

export const pageTag = {
  select: {
    tag: {
      select: {
        id: true,
        value: true
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
    tags: pageTag,
    chapter: {
      select: {
        authors: {
          select: { name: true }
        }
      }
    },
  }
};

export type CollectionCard = Prisma.PageGetPayload<typeof pageForCollectionPage>;
export type Tag = Prisma.TagsOnPagesGetPayload<typeof pageTag>;
