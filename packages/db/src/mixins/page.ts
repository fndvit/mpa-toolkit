import { publishEvent } from '@mpa/events';
import { logger } from '@mpa/log';
import type { Prisma } from '@prisma/client';
import { createLookup, type Expand } from '@mpa/utils';
import type { MpaDatabase } from '../db';
import * as Queries from '../queries';
import { calcReadTime } from '../readtime';
import type { APIRequests, Page } from '../types';
import { validate } from '../validation';
import { Recommender } from '../recommender';

const log = logger('DB');

export const pageMixin = (db: MpaDatabase) => {
  return {
    all: <
      {
        // overloads
        (opts: { model: 'content-card' }): Promise<Page.ContentCard[]>;
        (opts: { model: 'cms-list' }): Promise<Page.CmsList[]>;
        (opts: { model: 'recommender'; type: 'chapter' | 'case-study' | 'all' }): Promise<
          { id: number; tags: { id: number, category: string}[] }[]
        >;
      }
    >(async (opts: { model: string; type?: 'chapter' | 'case-study' | 'all' }) => {
      if (opts.model === 'content-card') {
        return db.prisma.page.findMany({
          where: { draft: false },
          ...Queries.pageForContentCard
        });
      } else if (opts.model === 'cms-list') {
        return db.prisma.page.findMany({
          ...Queries.pageForCmsList
        });
      } else if (opts.model === 'recommender') {
        const query = await db.prisma.page.findMany({
          select: { id: true, tags: { select: { tagId: true, category: true } } },
          where: {
            draft: false,
            ...(opts.type === 'chapter'
              ? { chapter: { isNot: null } }
              : opts.type === 'case-study'
              ? { caseStudy: { isNot: null } }
              : {})
          }
        });
        return query.map(({ id, tags }) => ({ id, tags: tags.map(t => ({id: t.tagId, category: t.category})) }));
      }
    }),

    collection: <
      {
        // overloads
        (opts: { tag: number }): Promise<Page.CollectionCard[]>;
        (opts: { tags: number[] }): Promise<Page.CollectionCard[]>;
      }
    >((opts: { tag?: number; tags?: number[] }) => {
      const getWhereClause = () => {
        if ('tag' in opts) return { tagId: opts.tag };
        else if ('tags' in opts) return { tag: { id: { in: opts.tags } } };
      };
      return db.prisma.page.findMany({
        where: {
          draft: false,
          tags: { some: getWhereClause() }
        },
        ...Queries.pageForCollectionCard
      });
    }),

    cards: (pageIds: number[]) =>
      db.prisma.page.findMany({
        where: { id: { in: pageIds }, draft: false },
        orderBy: { tags: { _count: 'asc' } },
        ...Queries.pageForContentCard
      }),

    get: <
      {
        // overloads
        (opts: { slug: string; draft?: boolean }): Promise<Page.Full>;
        (opts: { id: number; draft?: boolean }): Promise<Page.Full>;
      }
    >((opts: Prisma.PageWhereInput) => db.prisma.page.findFirst({ where: opts, ...Queries.pageFull }) as unknown as Promise<Page.Full>),

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getByTag: (tagId: number, model: 'collection') =>
      db.prisma.page.findMany({
        where: {
          tags: { some: { tag: { is: { id: tagId } } } },
          draft: false
        },
        ...Queries.pageForCollectionCard
      }),

    delete: async (id: number) => {
      const page = await db.prisma.page.findFirst({
        where: { id },
        include: { chapter: true, caseStudy: true }
      });

      if (!page) throw new Error(`Page not found with id ${id}`);

      log.info(`Deleting page ${id}: ${JSON.stringify(page)}`);

      const cascade = db.prisma.page.update({
        where: { id },
        data: {
          chapter: page.chapter ? { delete: true } : undefined,
          caseStudy: page.caseStudy ? { delete: true } : undefined,
          search: { delete: true },
          tags: { deleteMany: { OR: [{ pageId: { equals: id } }] } }
        }
      });

      const deletePage = db.prisma.page.delete({ where: { id } });

      await db.prisma.$transaction([cascade, deletePage]);

      await publishEvent('page-deleted', { id });

      return true;
    },

    create: async (page: APIRequests.Page, disableEvent = false) => {
      validate('page', page);

      const { title, slug, content, img, caseStudy, chapter, tags, draft } = page;

      const createPageQuery = db.prisma.page.create({
        data: {
          title,
          slug,
          content,
          img,
          draft,
          readTime: calcReadTime(content),
          tags: {
            createMany: {
              data: tags.map(({ id: tagId, category }) => ({ tagId, category }))
            }
          },
          caseStudy: caseStudy && { create: caseStudy },
          chapter: chapter && {
            create: {
              summary: chapter.summary,
              keyTakeaways: chapter.keyTakeaways,
              authors: { connect: chapter.authors.map(id => ({ id })) }
            }
          }
        }
      });

      const [_page] = await db.prisma.$transaction([
        createPageQuery,
        db.prisma.$queryRaw`SELECT CAST (create_page_search_index(last_value) AS TEXT) FROM "Page_id_seq"`
      ]);

      if (!disableEvent) {
        await publishEvent('page-created', { id: _page.id });
      }

      return _page;
    },

    update: async (id: number, page: APIRequests.Page) => {
      validate('page', page);

      const { title, slug, content, img, caseStudy, chapter, tags, draft } = page;

      const pageUpdateQuery = db.prisma.page.update({
        where: { id },
        data: {
          title,
          slug,
          content,
          img,
          draft,
          readTime: calcReadTime(content),
          tags: {
            deleteMany: { OR: [{ pageId: { equals: id } }] },
            createMany: {
              data: tags.map(({ id: tagId, category }) => ({ tagId, category }))
            }
          },
          caseStudy: caseStudy && { update: caseStudy },
          chapter: chapter && {
            update: {
              summary: { set: chapter.summary },
              keyTakeaways: { set: chapter.keyTakeaways },
              authors: { set: chapter.authors.map(id => ({ id })) }
            }
          },

          editedAt: new Date()
        }
      });

      const [_page] = await db.prisma.$transaction([
        pageUpdateQuery,
        db.prisma.$queryRaw`SELECT CAST (create_page_search_index(${id}) AS TEXT)`
      ]);

      await publishEvent('page-updated', { id });

      return _page;
    },

    getPageByType: async (type?: 'chapter' | 'case-study') =>
      db.prisma.page.findMany({
        where: {
          ...(type === 'chapter'
            ? { chapter: { isNot: null } }
            : type === 'case-study'
            ? { caseStudy: { isNot: null } }
            : {}),
          draft: false
        },
        orderBy: { tags: { _count: 'asc' } },
        ...Queries.pageForContentCard
      }),

    recommender: async (
      type: 'chapter' | 'case-study' | 'all',
      userHistory?: APIRequests.Recommendations,
      referencePageId?: number,
      numPages = 8
    ) => {
      const allPages = await db.page.all({ model: 'recommender', type });
      const pageToTagIds = new Map(allPages.map(p => [p.id, p.tags]));

      const madlibTags = userHistory?.madlib ? (await db.tag.get(userHistory.madlib)).map(t => t.id) : [];
      const referencePageTags = referencePageId ? pageToTagIds.get(referencePageId)?.map(t => t.id) ?? [] : [];
      const referencePagePrimaryStageTags = referencePageId ? pageToTagIds.get(referencePageId)
        ?.filter(t => t.category == "PRIMARY"  && t.id < 7)
        ?.map(t => t.id) ?? [] : [];
      const referencePagePrimaryNextStageTags = referencePageId ? [Math.max(...referencePagePrimaryStageTags) === 6 ? 0 : Math.max(...referencePagePrimaryStageTags) + 1] ?? [] : [];
      const pageViewTags =
        userHistory?.pageviews
          ?.filter(pageId => pageToTagIds.get(pageId))
          .flatMap(pageId => pageToTagIds.get(pageId)!)?.map(t => t.id) ?? [];

      const recommender = new Recommender(allPages.map(p => ({id: p.id, tagIds: p.tags.map(t => t.id)})));
      const topPages = new Set<number>();
      const guideLines = Recommender.getGuidelines(
        !!pageViewTags?.length,
        !!madlibTags?.length,
        !!referencePageTags?.length
      );
      const weights = [
        [guideLines.pageViews, pageViewTags],
        [guideLines.madlib, madlibTags],
        [guideLines.referencePage, referencePageTags],
        [guideLines.referencePage, referencePagePrimaryStageTags],
        [guideLines.referencePage, referencePagePrimaryNextStageTags]
      ] as const;

      weights.forEach(([weight, tags]) => {
        const numRecommendations = weight && Math.round(weight * numPages);
        if (numRecommendations) {
          recommender.getRecommendations(tags, numRecommendations, referencePageId).forEach(id => topPages.add(id));
        }
      });

      recommender.getRandomFill([...topPages], numPages, referencePageId).forEach(pageId => topPages.add(pageId));

      return [...topPages];
    },

    async search<S extends Prisma.PageFindManyArgs>(searchText: string, fields: S) {
      const searchResult = await db.prisma.$queryRaw<
        { id: number; rank: number; highlights: string }[]
      >`SELECT * FROM search_pages(${searchText})`;
      const searchLookup = createLookup(
        searchResult,
        r => r.id.toString(),
        r => r
      );

      const pages = await db.prisma.page.findMany({
        where: {
          draft: false,
          id: { in: searchResult.map(r => r.id) },
          ...fields.where
        },
        select: { id: true, ...fields.select }
      });

      return pages
        .map(p => {
          const { rank, highlights } = searchLookup[p.id.toString()]!;
          return { ...p, rank, highlights };
        })
        .sort((a, b) => b.rank - a.rank) as Expand<Prisma.PageGetPayload<S> & { rank: number; highlights: string }>[];
    }
  };
};
