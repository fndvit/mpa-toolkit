import { publishEvent } from '@mpa/events';
import similarity from 'compute-cosine-similarity';
import { logger } from '@mpa/log';
import type { Prisma } from '@prisma/client';
import { createLookup, type Expand } from '@mpa/utils';
import type { MpaDatabase } from '../db';
import * as Queries from '../queries';
import { calcReadTime } from '../readtime';
import type { APIRequests, Page, Tag } from '../types';
import { validate } from '../validation';


const log = logger('DB');

const NUM_RECOMMENDED_PAGES = 8; //Number of pages to be recommended

const generateGuideVector = (tags: Tag[]) => {
  return tags.map((tag) => tag.id);
};

const generateWeightedVector = (tags: Tag[], guideVector: number[], tagsIDF) => {
  let vector = new Array(guideVector.length);
  vector = vector.fill(0);
  tags.forEach(t => {
    vector[guideVector.indexOf(t.id)] += 1 * tagsIDF.find(tag => tag.id === t.id).idf;
  });
  return vector;
};

const getGuidelines = (userHistory?: APIRequests.Recommendations, referencePageId?: number) => {

  const guideLines = {
    madlib: 0,
    pageViews: 0,
    referencePage: 0,
    random: 0,
  };

  if (!userHistory?.madlib && !userHistory?.pageviews && !referencePageId){
    guideLines.random = 1;
  } else if (userHistory?.pageviews && !userHistory?.madlib && !referencePageId) {
    guideLines.pageViews = 1/2; guideLines.random = 1/2;
  } else if (!userHistory?.pageviews && userHistory?.madlib && !referencePageId) {
    guideLines.madlib = 2/3; guideLines.random = 1/3;
  } else if (userHistory?.pageviews && userHistory?.madlib && !referencePageId) {
    guideLines.pageViews = 1/3; guideLines.madlib = 1/2; guideLines.random = 1/6;
  } else {
    guideLines.referencePage = 1;
  }

  return guideLines;
};

const compare = function(a, b) {
  return (parseFloat(a[1]) > parseFloat(b[1])) ? -1 : (parseFloat(a[1]) == parseFloat(b[1])) ? 0 : 1;
};

const contentBasedFiltering = async (db: MpaDatabase, type: 'chapter' | 'case-study', userHistory?: APIRequests.Recommendations, referencePageId?: number) => {
  const allPages = await db.page.getPageByType(type);
  const allTags = await db.tag.allForRecommender();
  const guideLines = getGuidelines(userHistory, referencePageId);

  //Calculate IDF for each tag
  const tagsIDF = allTags.map(tag => {
    return {
      id: tag.id,
      idf: Math.log(allPages.length / tag._count.pageTags),
    };
  });

  //Generate guide vector
  const guideVector = generateGuideVector(allTags);

  let madlibTags: Tag[] = [];
  let referencePageTags: Tag[] = [];
  const pagesViewsTags: Tag[] = [];

  //Get tags for all kinds of user history
  if(userHistory?.madlib && guideLines.madlib > 0) madlibTags = allTags.filter(tag => userHistory?.madlib?.includes(tag.value));
  if(referencePageId && guideLines.referencePage > 0) referencePageTags = (allPages.find(page => page.id === referencePageId)?.tags)?.map(t => t.tag) || [];
  if(userHistory?.pageviews && guideLines.pageViews > 0)  userHistory.pageviews.forEach(pageId => allPages.find(p => p.id === pageId)?.tags?.forEach(t => pagesViewsTags.push(t.tag)));

  //Generate weighted vectors for all kinds of user history
  const referenceMadlibWeightedVector = madlibTags.length > 0 ? generateWeightedVector(madlibTags, guideVector, tagsIDF): null;
  const referencePageWeightedVector = referencePageTags.length > 0 ? generateWeightedVector(referencePageTags, guideVector, tagsIDF) : null;
  const referencePageViewsWeigthedVector = pagesViewsTags.length > 0 ? generateWeightedVector(pagesViewsTags, guideVector, tagsIDF) : null;

  let madlibCandidates: [Page.ContentCard, number][] = [];
  let pageCandidates: [Page.ContentCard, number][] = [];
  let pageviewsCandidates: [Page.ContentCard, number][] = [];

  //Calculate similarity for all pages
  allPages.map( page => {
    if(page.id !== referencePageId){
       //Calculate weighted vector for the current page
      const vector = generateWeightedVector(page.tags.map(t => t.tag), guideVector, tagsIDF);

      //Calculate similarity for the current page
      const cosineSimilarityMadlib = referenceMadlibWeightedVector && guideLines.madlib > 0 ? similarity(referenceMadlibWeightedVector, vector) : -1;
      const cosineSimilarityReferencePage = referencePageWeightedVector && guideLines.referencePage > 0 ? similarity(referencePageWeightedVector, vector) : -1;
      const cosineSimilarityViewedPages = referencePageViewsWeigthedVector && guideLines.pageViews > 0 ? similarity(referencePageViewsWeigthedVector, vector) : -1;

      //Add the current page to the candidates list
      if(cosineSimilarityMadlib > 0) madlibCandidates.push([page, isNaN(cosineSimilarityMadlib) ? 0 : cosineSimilarityMadlib]);
      if(cosineSimilarityReferencePage > 0 ) pageCandidates.push([page, isNaN(cosineSimilarityReferencePage) ? 0 : cosineSimilarityReferencePage]);
      if(cosineSimilarityViewedPages > 0) pageviewsCandidates.push([page, isNaN(cosineSimilarityViewedPages) ? 0 : cosineSimilarityViewedPages]);
    }
  });

  //Sort the candidates list
  madlibCandidates = madlibCandidates.sort(compare);
  pageCandidates = pageCandidates.sort(compare);
  pageviewsCandidates = pageviewsCandidates.sort(compare);

  //Get the top 8 pages
  const topPages = new Set();

  const madlibTop = madlibCandidates.slice(0, NUM_RECOMMENDED_PAGES * guideLines.madlib);
  madlibTop.forEach(page => topPages.add(page[0]));

  const pageTop = pageCandidates.filter(page => !topPages.has(page[0])).slice(0, NUM_RECOMMENDED_PAGES * guideLines.referencePage);
  pageTop.forEach(page => topPages.add(page[0]));

  const pageViewsTop = pageviewsCandidates.filter(page => !topPages.has(page[0])).slice(0, NUM_RECOMMENDED_PAGES * guideLines.pageViews);
  pageViewsTop.forEach(page => topPages.add(page[0]));

  const randomPages = allPages.filter(page => !topPages.has(page)).slice(0, NUM_RECOMMENDED_PAGES - topPages.size);
  randomPages.forEach(page => topPages.add(page));

  return Array.from(topPages) as Page.ContentCard[];
};

export const pageMixin = (db: MpaDatabase) => {
  return {
    all: <
      {
        // overloads
        (opts: { model: 'content-card' }): Promise<Page.ContentCard[]>;
        (opts: { model: 'cms-list' }): Promise<Page.CmsList[]>;
      }
    >((opts: { model: string }) => {
      if (opts.model === 'content-card') {
        return db.prisma.page.findMany({
          where: { draft: false },
          ...Queries.pageForContentCard
        });
      } else if (opts.model === 'cms-list') {
        return db.prisma.page.findMany({
          ...Queries.pageForCmsList
        });
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
          ...(type === 'chapter' ? { chapter:  { isNot: null } } : (type === 'case-study' ? { caseStudy: { isNot: null } } :
              {})),
          draft: false,
        },
        orderBy: { tags: { _count: 'asc' } },
        ...Queries.pageForContentCard
      }),

    recommender: async (userHistory: APIRequests.Recommendations, type: 'chapter' | 'case-study', referencePageId?: number) =>
      await contentBasedFiltering(db, type, userHistory, referencePageId),


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
