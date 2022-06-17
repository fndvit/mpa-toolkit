import type { Prisma } from "@prisma/client";
import { error404 } from "$lib/errors";
import { prisma } from "$lib/prisma";
import type { PageRequest, SubTypes, TagRequest } from "$lib/types";
import { calcReadTime } from "$lib/readtime";
import { validate } from "$lib/schema/validation";
import { pageForContentCard, pageFull, tag } from "./queries";
import { createLookup, type Expand } from "$lib/helpers/utils";
import { publishEvent } from "$lib/events";

export async function getPage(slug: string, draft = false) {
  return prisma.page.findFirst({
    where: { slug, draft },
    ...pageFull
  });
}

export async function getRecommendedPages(page: Pick<SubTypes.Page.Full, 'id' | 'tags'>) {
  return await prisma.page.findMany({
    where: {
      draft: false,
      tags: { some: { OR: page.tags.map(t => ({ tagId: t.tag.id })) } },
      NOT: { id: page.id }
    },
    orderBy: { tags: { _count: 'asc' } },
    ...pageForContentCard
  });
};

export async function getPageComponentProps(slug: string, draft = false) {

  const page = await getPage(slug, draft);

  if (!page) return error404('Page not found');

  const recommendedPages = await getRecommendedPages(page);

  return {
    body: {
      page,
      recommendedPages
    }
  };
};

export async function updatePage(id: number, page: PageRequest) {

  validate('page', page);

  const { title, slug, content, img, caseStudy, chapter, tags, draft } = page;

  const pageUpdateQuery = prisma.page.update({
    where: { id },
    data: {
      title, slug, content, img, draft,
      readTime: calcReadTime(content),
      tags: {
        deleteMany: { OR: [ { pageId: { equals: id } }, ] },
        createMany: {
          data: tags.map(({id: tagId, category}) => ({ tagId, category }))
        },
      },
      caseStudy: caseStudy && { update: caseStudy },
      chapter: chapter && {
        update: {
          summary: { set: chapter.summary },
          keyTakeaways: { set: chapter.keyTakeaways },
          authors: { set: chapter.authors.map(id => ({id})) },
        }
      },

      editedAt: new Date()
    }
  });

  const [_page] = await prisma.$transaction([
    pageUpdateQuery,
    prisma.$queryRaw`SELECT CAST (create_page_search_index(${id}) AS TEXT)`
  ]);

  await publishEvent('page-updated', { id });

  return _page;
}

export async function deletePage(id: number) {

  const page = await prisma.page.findFirst({
    where: { id },
    include: { chapter: true, caseStudy: true }
  });

  const cascade = prisma.page.update({
    where: { id },
    data: {
      chapter: page.chapter ? { delete: true } : undefined,
      caseStudy: page.caseStudy ? { delete: true } : undefined,
      search: { delete: true },
      tags: { deleteMany: { OR: [ { pageId: { equals: id } }, ] } }
    }
  });

  const deletePage = prisma.page.delete({ where: { id } });

  await prisma.$transaction([cascade, deletePage]);

  await publishEvent('page-deleted', { id });

  return true;
}

export async function createPage(page: PageRequest) {

  validate('page', page);

  const { title, slug, content, img, caseStudy, chapter, tags, draft } = page;

  const createPageQuery = prisma.page.create({
    data: {
      title, slug, content, img, draft,
      readTime: calcReadTime(content),
      tags: {
        createMany: {
          data: tags.map(({id: tagId, category}) => ({ tagId, category }))
        },
      },
      caseStudy: caseStudy && { create: caseStudy },
      chapter: chapter && {
        create: {
          summary: chapter.summary,
          keyTakeaways: chapter.keyTakeaways,
          authors: { connect: chapter.authors.map(id => ({id})) }
        }
      }
    }
  });

  const [_page] = await prisma.$transaction([
    createPageQuery,
    prisma.$queryRaw`SELECT CAST (create_page_search_index(last_value) AS TEXT) FROM "Page_id_seq"`
  ]);

  await publishEvent('page-created', { id: _page.id });

  return _page;
}

async function _searchPages(searchText: string) {
  const results: { id: number, rank: number, highlights: string }[] =
    await prisma.$queryRaw`SELECT * FROM search_pages(${searchText})`;
  return results;
}

export async function searchPages<S extends Prisma.PageFindManyArgs> (searchText: string, fields: S) {
  const searchResult = await _searchPages(searchText);
  const searchLookup = createLookup(searchResult, r => r.id.toString(), r => r);

  const pages = await prisma.page.findMany({
    where: {
      id: { in: searchResult.map(r => r.id) },
      draft: false,
      ...fields.where
    },
    select: {
      id: true,
      ...fields.select
    },
  });

  return pages
    .map(p => {
      const searchResult = searchLookup[p.id.toString()];
      return {
        ...p,
        rank: searchResult.rank,
        highlights: searchResult.highlights,
      };
    })
    .sort((a, b) => b.rank - a.rank) as Expand<Prisma.PageGetPayload<S> & { rank: number, highlights: string }>[];
}

export async function searchTags(searchText: string) {
  const results: {tagId: number, highlight: string}[] =
    await prisma.$queryRaw`SELECT * FROM tag_highlights(${searchText})`;
  const o = Object.fromEntries(
    results.map(r => [r.tagId, r.highlight])
  ) as {[tagId: number]: string};
  return o;
}

export async function updateTag(id: number, tag: TagRequest) {

  validate('tag', tag);

  if(tag.type !== 'TOPIC') return false;
  if(tag.value.length > 30) return false;

  const { value, type } = tag;

  const tagUpdateQuery = prisma.tag.update({
    where: { id },
    data: {
      value, type,
    }
  });

  const [_tag] = await prisma.$transaction([
    tagUpdateQuery
  ]);

  await publishEvent('tag-updated', { id });

  return _tag;
}

export async function deleteTag(id: number) {

  const tag = await prisma.tag.findFirst({
    where: { id }
  });

  if(tag.type !== 'TOPIC') return false;

  const cascade = prisma.tagsOnPages.deleteMany({
    where: { tagId: id }
  });

  const deleteTag = prisma.tag.delete({ where: { id } });

  await prisma.$transaction([cascade, deleteTag]);

  await publishEvent('tag-deleted', { id });

  return true;
}

export async function createTag(tag: TagRequest) {
  console.log('createTag', tag);
  validate('tag', tag);

  const { value, type } = tag;

  const createTagQuery = prisma.tag.create({
    data: {
      value, type
    }
  });

  const [_tag] = await prisma.$transaction([
    createTagQuery
  ]);

  await publishEvent('page-created', { id: _tag.id });

  return _tag;
}