import { publishEvent } from '@mpa/events';
import { logger } from '@mpa/log';
import type { Prisma } from '@prisma/client';
import { createLookup, isTruthy, type Expand } from '@mpa/utils';
import type { MpaDatabase } from '../db';
import * as Queries from '../queries';
import { calcReadTime } from '../readtime';
import type { APIRequests, Page } from '../types';
import { validate } from '../validation';
import { Recommender } from '../recommender';
import type { LogConfig } from './mixin';
import { DBMixin } from './mixin';

const _log = logger('DB');

type RecommenderParams = {
  madlib?: string[];
  pageviews?: number[];
  referencePageId?: number;
  numPages?: number;
};

export class PageMixin extends DBMixin {
  constructor(db: MpaDatabase) {
    const logCfg: LogConfig<PageMixin> = {
      create: ([page], result) => [page.title, result?.id],
      update: ([id], result) => [id, !!result],
      delete: ([id], result) => [id, result]
    };
    super('page', db, logCfg);
  }

  async allForRecommender(type: 'chapter' | 'case-study' | 'all') {
    const query = await this.db.prisma.page.findMany({
      select: { id: true, tags: { select: { tagId: true, category: true } } },
      where: {
        draft: false,
        ...(type === 'chapter'
          ? { chapter: { isNot: null } }
          : type === 'case-study'
          ? { caseStudy: { isNot: null } }
          : {})
      }
    });
    return query.map(({ id, tags }) => ({
      id,
      tags: tags.map(t => ({ id: t.tagId, category: t.category }))
    }));
  }

  async allContentCards(): Promise<Page.ContentCard[]> {
    return this.db.prisma.page.findMany({
      where: { draft: false },
      ...Queries.pageForContentCard
    });
  }

  async allForCms(): Promise<Page.CmsList[]> {
    return this.db.prisma.page.findMany({
      ...Queries.pageForCmsList
    });
  }

  async collection(opts: { tag: number }): Promise<Page.CollectionCard[]>;
  async collection(opts: { tags: number[] }): Promise<Page.CollectionCard[]>;
  async collection(opts: { tag?: number; tags?: number[] }) {
    const getWhereClause = () => {
      if ('tag' in opts) return { tagId: opts.tag };
      else if ('tags' in opts) return { tag: { id: { in: opts.tags } } };
    };
    return this.db.prisma.page.findMany({
      where: {
        draft: false,
        tags: { some: getWhereClause() }
      },
      ...Queries.pageForCollectionCard
    });
  }

  async get(opts: { slug: string; draft?: boolean }): Promise<Page.Full>;
  async get(opts: { id: number; draft?: boolean }): Promise<Page.Full>;
  async get(opts: Prisma.PageWhereInput) {
    return this.db.prisma.page.findFirst({ where: opts, ...Queries.pageFull }) as unknown as Promise<Page.Full>;
  }

  async cards(pageIds: number[]) {
    return this.db.prisma.page.findMany({
      where: { id: { in: pageIds }, draft: false },
      orderBy: { tags: { _count: 'asc' } },
      ...Queries.pageForContentCard
    });
  }

  async getByTag(tagId: number) {
    return this.db.prisma.page.findMany({
      where: {
        tags: { some: { tag: { is: { id: tagId } } } },
        draft: false
      },
      ...Queries.pageForCollectionCard
    });
  }

  async delete(id: number) {
    const page = await this.db.prisma.page.findFirst({
      where: { id },
      include: { chapter: true, caseStudy: true }
    });

    if (!page) throw new Error(`Page not found with id ${id}`);

    _log.info(`Deleting page ${id}: ${JSON.stringify(page)}`);

    const cascade = this.db.prisma.page.update({
      where: { id },
      data: {
        chapter: page.chapter ? { delete: true } : undefined,
        caseStudy: page.caseStudy ? { delete: true } : undefined,
        search: { delete: true },
        tags: { deleteMany: { OR: [{ pageId: { equals: id } }] } }
      }
    });

    const deletePage = this.db.prisma.page.delete({ where: { id } });

    await this.db.prisma.$transaction([cascade, deletePage]);

    await publishEvent('page-deleted', { id });

    return true;
  }

  async create(page: APIRequests.Page, disableEvent = false) {
    validate('page', page);

    const { title, slug, content, img, caseStudy, chapter, tags, draft } = page;

    const createPageQuery = this.db.prisma.page.create({
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

    const [_page] = await this.db.prisma.$transaction([
      createPageQuery,
      this.db.prisma.$queryRaw`SELECT CAST (create_page_search_index(last_value) AS TEXT) FROM "Page_id_seq"`
    ]);

    if (!disableEvent) {
      await publishEvent('page-created', { id: _page.id });
    }

    return _page;
  }

  async update(id: number, page: APIRequests.Page) {
    validate('page', page);

    const { title, slug, content, img, caseStudy, chapter, tags, draft } = page;

    const pageUpdateQuery = this.db.prisma.page.update({
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

    const [_page] = await this.db.prisma.$transaction([
      pageUpdateQuery,
      this.db.prisma.$queryRaw`SELECT CAST (create_page_search_index(${id}) AS TEXT)`
    ]);

    await publishEvent('page-updated', { id });

    return _page;
  }

  async getPageByType(type?: 'chapter' | 'case-study') {
    return this.db.prisma.page.findMany({
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
    });
  }

  async recommender(
    type: 'chapter' | 'case-study' | 'all',
    { madlib = [], pageviews = [], referencePageId, numPages = 8 }: RecommenderParams = {}
  ) {
    const allPages = await this.allForRecommender(type);
    const pageToTagIds = new Map(allPages.map(p => [p.id, p.tags]));

    const tagFunctions = {
      // helper functions to get all the required tagIds
      reference: async (pageId?: number) => {
        if (!pageId) return { all: [], primaryStage: [], nextStage: [] };
        const tags = pageToTagIds.get(pageId) || [];
        const primaryStageTagIds = tags.filter(t => t.category == 'PRIMARY' && t.id < 7).map(t => t.id);
        const nextStage = Math.max(-1, ...primaryStageTagIds) + 1;
        return {
          all: tags.map(t => t.id),
          primaryStage: primaryStageTagIds,
          nextStage: [nextStage === 7 ? 0 : nextStage]
        };
      },

      madlib: async (madlib?: string[]): Promise<number[]> => (madlib && this.db.tag.getIds(madlib)) || [],

      pageview: async (pageviews: number[] = []) =>
        pageviews
          .map(pageId => pageToTagIds.get(pageId))
          .filter(isTruthy)
          .flat()
          .map(t => t.id)
    };

    const tagIds = {
      madlib: await tagFunctions.madlib(madlib),
      pageview: await tagFunctions.pageview(pageviews),
      reference: await tagFunctions.reference(referencePageId)
    };

    const recommender = new Recommender(allPages.map(p => ({ id: p.id, tagIds: p.tags.map(t => t.id) })));

    const guidelines = Recommender.getGuidelines(
      !!tagIds.pageview.length,
      !!tagIds.madlib.length,
      !!tagIds.reference.all.length
    );

    const weights = [
      [guidelines.pageViews, tagIds.pageview],
      [guidelines.madlib, tagIds.madlib],
      [guidelines.referencePage, tagIds.reference.all],
      [guidelines.referencePage, tagIds.reference.primaryStage],
      [guidelines.referencePage, tagIds.reference.nextStage]
    ] as const;

    const topPages = new Set(
      weights
        .filter((w): w is [number, number[]] => !!w[0])
        .flatMap(([weight, tags]) =>
          recommender.getRecommendations(tags, weight && Math.round(weight * numPages), referencePageId)
        )
    );

    const filledPages = new Set([...topPages, ...recommender.getRandomFill([...topPages], numPages, referencePageId)]);

    return [...filledPages];
  }

  async search<S extends Prisma.PageFindManyArgs>(searchText: string, fields: S) {
    const searchResult = await this.db.prisma.$queryRaw<
      { id: number; rank: number; highlights: string }[]
    >`SELECT * FROM search_pages(${searchText})`;
    const searchLookup = createLookup(
      searchResult,
      r => r.id.toString(),
      r => r
    );

    const pages = await this.db.prisma.page.findMany({
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
}
