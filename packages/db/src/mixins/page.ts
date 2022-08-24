import { publishEvent } from '@mpa/events';
import { logger } from '@mpa/log';
import type { Prisma } from '@prisma/client';
import { createLookup, type Expand } from '@mpa/utils';
import type { MpaDatabase } from '../db';
import * as Queries from '../queries';
import { calcReadTime } from '../readtime';
import type { APIRequests, Page } from '../types';
import { validate } from '../validation';

const log = logger('DB');

export const pageMixin = (db: MpaDatabase) => {
  function get(opts: { slug: string; draft?: boolean }): Promise<Page.Full>;
  function get(opts: { id: number; draft?: boolean }): Promise<Page.Full>;
  async function get(opts: Prisma.PageWhereInput) {
    return db.prisma.page.findFirst({ where: opts, ...Queries.pageFull }) as unknown;
  }

  async function update(id: number, page: APIRequests.Page) {
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
  }

  async function deletePage(id: number) {
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
  }

  async function create(page: APIRequests.Page) {
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

    await publishEvent('page-created', { id: _page.id });

    return _page;
  }

  async function recommended(page: Pick<Page, 'id' | 'tags'>) {
    return await db.prisma.page.findMany({
      where: {
        draft: false,
        tags: { some: { OR: page.tags.map(t => ({ tagId: t.tag.id })) } },
        NOT: { id: page.id }
      },
      orderBy: { tags: { _count: 'asc' } },
      ...Queries.pageForContentCard
    });
  }

  return {
    get,
    delete: deletePage,
    create,
    update,
    recommended,
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
        where: { id: { in: searchResult.map(r => r.id) }, draft: false, ...fields.where },
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
