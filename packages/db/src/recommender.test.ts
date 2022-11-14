import { loadEnvFromFile } from '@mpa/env';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { createLookup, range } from '@mpa/utils';
import { MpaDatabase } from '..';
import type { Page } from '..';
import { Recommender } from './recommender';
import { generateEmptyPage } from './lib/test-utils';
import { t } from 'vitest/dist/index-4a906fa4';

const env = loadEnvFromFile('test', { DATABASE_URL: true });

const db = new MpaDatabase();

describe('recommender', () => {
  describe('unittests', () => {
    test('getPageCountsByTag', async () => {
      const tagCounts = Recommender.getPageCountsByTag([
        { id: 1, tagIds: [1, 2, 3] },
        { id: 2, tagIds: [1, 2, 3] },
        { id: 3, tagIds: [2, 3, 4] },
        { id: 4, tagIds: [4, 5, 6] }
      ]);

      expect(tagCounts).toEqual({ 1: 2, 2: 3, 3: 3, 4: 2, 5: 1, 6: 1 });

      const tagCounts2 = Recommender.getPageCountsByTag([
        { id: 1, tagIds: [1, 2, 3] },
        { id: 2, tagIds: [1, 2, 3] },
        { id: 3, tagIds: [2, 3, 4] },
        { id: 4, tagIds: [4, 5, 6] },
        { id: 5, tagIds: [1, 2, 3] },
        { id: 6, tagIds: [1, 2, 3] },
        { id: 7, tagIds: [2, 3, 4] },
        { id: 8, tagIds: [4, 5, 6] },
        { id: 9, tagIds: [1, 2, 3] }
      ]);

      expect(tagCounts2).toEqual({ 1: 5, 2: 7, 3: 7, 4: 4, 5: 2, 6: 2 });
    });

    test('generateWeightedVector', async () => {
      const recommender = new Recommender([
        { id: 1, tagIds: [1, 2, 3] },
        { id: 2, tagIds: [1, 2, 3] },
        { id: 3, tagIds: [2, 3, 4] },
        { id: 4, tagIds: [4, 5, 6] }
      ]);

      const vector = recommender.generateWeightedVector([1, 2, 3]);

      expect(vector.length).toEqual(6); // 6 input tags
      expect(vector.slice(3)).toEqual([0, 0, 0]); // weighted vector is 0 for non-input tags
      expect(vector[0]).toBeGreaterThan(vector[1]); // tag 1 is more important than tag 2
      expect(vector[0]).toBeGreaterThan(vector[2]); // tag 1 is more important than tag 3
      expect(vector[1]).toEqual(vector[2]); // tag 2 and 3 are equally important
    });
  });

  describe('basic data', () => {
    let pageLookup: { [x: number]: Page | undefined };
    let pages: Page.DB[];

    beforeAll(async () => {
      await db.prisma.tagsOnPages.deleteMany();
      await db.prisma.tag.deleteMany();
      await db.prisma.search.deleteMany();
      await db.prisma.caseStudy.deleteMany();
      await db.prisma.chapter.deleteMany();
      await db.prisma.page.deleteMany();

      const tags = await Promise.all(
        range(1, 12).map(id => db.prisma.tag.create({ data: { id, value: `tag${id}`, type: 'TOPIC' } }))
      );

      const testPages: [string /*slug*/, number[] /*tagIds*/][] = [
        ...range(0, 20).map(i => [`page${i}`, [1, 2, 3]] as [string, number[]]),
        ['a', [4, 5, 6, 7]],
        ['b', [7, 8, 9, 10]],
        ['c', [4, 6, 8, 10]],
        ['d', [5, 7, 9, 11]]
      ];

      pages = [];

      for (const [slug, tagIds] of testPages) {
        const page = await db.page.create({
          ...generateEmptyPage('chapter'),
          tags: tagIds.map(id => ({ id, category: 'PRIMARY' })),
          slug,
          draft: false
        });
        pages.push(page);
      }

      pageLookup = createLookup(pages, p => p.id);
    });

    test('calcSimilarities', async () => {
      const allPages = await db.page.all.recommender('all');
      const recommender = new Recommender(allPages.map(p => ({ id: p.id, tagIds: p.tags.map(t => t.id) })));

      const sim = recommender.calcSimilarities([4, 6, 8, 10]);

      sim.forEach(v => {
        expect(v[0]).toBeTypeOf('number');
        expect(v[0]).not.toBe(NaN);
        expect(v[1]).toBeTypeOf('number');
        expect(v[1]).not.toBe(NaN);
      });
    });

    test('getRecommendations', async () => {
      const allPages = await db.page.all.recommender('all');
      const recommender = new Recommender(allPages.map(p => ({ id: p.id, tagIds: p.tags.map(t => t.id) })));

      const r = recommender.getRecommendations([4, 6, 8, 9], 4);
      expect(r.length).toEqual(4);
      const recommendedSlugs = r.map(id => pageLookup[id]?.slug);
      expect(recommendedSlugs).containSubset(['a', 'b', 'c', 'd']);
    });

    test('end-to-end', async () => {
      const pageViews = ['a', 'b'].map(slug => pages.find(p => p.slug === slug)!.id);
      const pageIds = await db.page.recommender('all', { pageviews: pageViews });
      expect(pageIds.length).toEqual(8);
      const cards = await db.page.cards(pageIds);
      const recommendedSlugs = cards.map(c => c.slug);
      expect(recommendedSlugs).containSubset(['c', 'd']);
    });
  });

  describe('w/ typed data', () => {
    let pages: Page.DB[];

    beforeAll(async () => {
      await db.prisma.tagsOnPages.deleteMany();
      await db.prisma.tag.deleteMany();
      await db.prisma.search.deleteMany();
      await db.prisma.caseStudy.deleteMany();
      await db.prisma.chapter.deleteMany();
      await db.prisma.page.deleteMany();

      const tags = await Promise.all(
        range(1, 12).map(id => db.prisma.tag.create({ data: { id, value: `tag${id}`, type: 'TOPIC' } }))
      );

      const testChapters: [string /*slug*/, number[] /*tagIds*/][] = [
        ...range(1, 10).map(i => [`chapter-${i}`, [1, 2, 3]] as [string, number[]]),
        ['chapter-a', [4, 5, 6, 7]],
        ['chapter-b', [7, 8, 9, 10]]
      ];

      const testCaseStudies: [string /*slug*/, number[] /*tagIds*/][] = [
        ...range(1, 10).map(i => [`casestudy-${i}`, [1, 2, 3]] as [string, number[]]),
        ['casestudy-a', [4, 6, 8, 10]],
        ['casestudy-b', [5, 7, 9, 11]]
      ];

      pages = [];

      for (const [slug, tagIds] of testChapters) {
        const page = await db.page.create({
          ...generateEmptyPage('chapter'),
          tags: tagIds.map(id => ({ id, category: 'PRIMARY' })),
          slug,
          draft: false
        });
        pages.push(page);
      }

      for (const [slug, tagIds] of testCaseStudies) {
        const page = await db.page.create({
          ...generateEmptyPage('caseStudy'),
          tags: tagIds.map(id => ({ id, category: 'PRIMARY' })),
          slug,
          draft: false
        });
        pages.push(page);
      }
    });

    test('chapters', async () => {
      const pageViews = ['casestudy-a', 'chapter-a'].map(slug => pages.find(p => p.slug === slug)!.id);
      const pageIds = await db.page.recommender('chapter', { pageviews: pageViews }, undefined);
      expect(pageIds.length).toEqual(8);
      const cards = await db.page.cards(pageIds);
      cards.forEach(c => expect(c.chapter).toBeTruthy());
    });

    test('casestudy', async () => {
      const pageViews = ['casestudy-a', 'chapter-a'].map(slug => pages.find(p => p.slug === slug)!.id);
      const pageIds = await db.page.recommender('case-study', { pageviews: pageViews }, undefined);
      const cards = await db.page.cards(pageIds);
      cards.forEach(c => expect(c.caseStudy).toBeTruthy());
    });
  });

  describe('w/ custom data', () => {
    beforeEach(async () => {
      await db.prisma.tagsOnPages.deleteMany();
      await db.prisma.tag.deleteMany();
      await db.prisma.search.deleteMany();
      await db.prisma.caseStudy.deleteMany();
      await db.prisma.chapter.deleteMany();
      await db.prisma.page.deleteMany();
    });

    test('<8 published pages', async () => {
      await db.prisma.tag.create({ data: { id: 1, value: `tag$1`, type: 'TOPIC' } });

      await db.page.create({ ...generateEmptyPage('chapter'), tags: [], slug: 'a', draft: false });
      await db.page.create({ ...generateEmptyPage('chapter'), tags: [], slug: 'b', draft: false });
      await db.page.create({ ...generateEmptyPage('chapter'), tags: [], slug: 'c', draft: false });

      const pageIds = await db.page.recommender('all');
      expect(pageIds.length).toEqual(3);
    });

    test("don't recommend reference page", async () => {
      await db.prisma.tag.create({ data: { id: 1, value: `tag$1`, type: 'TOPIC' } });

      const refPage = await db.page.create({ ...generateEmptyPage('chapter'), tags: [], slug: 'a', draft: false });
      await db.page.create({ ...generateEmptyPage('chapter'), tags: [], slug: 'b', draft: false });
      await db.page.create({ ...generateEmptyPage('chapter'), tags: [], slug: 'c', draft: false });
      await db.page.create({ ...generateEmptyPage('chapter'), tags: [], slug: 'd', draft: false });

      const pageIds = await db.page.recommender('all', undefined, refPage.id);
      expect(pageIds).not.toContain(refPage.id);
      expect(pageIds.length).toEqual(3);
    });
  });
});
