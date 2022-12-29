/// <reference path="./types/modules.d.ts" />
import { getXRandItems, groupBy } from '@mpa/utils';
import similarity from 'compute-cosine-similarity';

export class Recommender {
  allPageIds: number[];
  allTagIds: number[];
  idfs: Map<number, number>;
  pageVectors: Map<number, number[]>;

  constructor(allPages: { id: number; tagIds: number[] }[]) {
    this.allPageIds = allPages.map(p => p.id);
    const pageCountsByTag = Recommender.getPageCountsByTag(allPages);
    this.allTagIds = Object.keys(pageCountsByTag).map(Number);
    this.idfs = new Map(this.allTagIds.map(tagId => [tagId, Math.log(allPages.length / pageCountsByTag[tagId])]));
    this.pageVectors = new Map(allPages.map(({ id, tagIds }) => [id, this.generateWeightedVector(tagIds)]));
  }

  generateWeightedVector(tagIds: number[]) {
    const groupedTags = groupBy(tagIds, t => t);
    return this.allTagIds.map(tagId => this.idfs.get(tagId)! * (groupedTags[tagId]?.length || 0));
  }

  calcSimilarities(tagIds: number[]) {
    const weightedVector = this.generateWeightedVector(tagIds);
    return this.allPageIds
      .map(pageId => [pageId, similarity(weightedVector, this.pageVectors.get(pageId)!)] as [number, number])
      .sort((a, b) => b[1] - a[1]);
  }

  getRecommendations(tagIds: number[], numRecommendations: number, omitId?: number) {
    if (!tagIds.length || numRecommendations === 0) return [];
    const similarities = this.calcSimilarities(tagIds);
    return similarities
      .filter(([id]) => id !== omitId)
      .map(s => s[0])
      .slice(0, numRecommendations);
  }

  getRandomFill(recommendations: number[], numRecommendations: number, omitId?: number) {
    const unpickedIds = this.allPageIds.filter(id => id !== omitId && !recommendations.includes(id));
    return getXRandItems(unpickedIds, numRecommendations - recommendations.length);
  }

  static getPageCountsByTag(pages: { id: number; tagIds: number[] }[]) {
    return pages.reduce((acc, { tagIds }) => {
      tagIds.forEach(tagId => (acc[tagId] = (acc[tagId] || 0) + 1));
      return acc;
    }, {} as Record<number, number>);
  }

  static getGuidelines(pageviews: boolean, madlib: boolean, referencePage: boolean) {
    if (referencePage) return { referencePage: 0.33 };
    else if (madlib && pageviews) return { pageViews: 1 / 3, madlib: 1 / 2 };
    else if (pageviews) return { pageViews: 1 / 2 };
    else if (madlib) return { madlib: 2 / 3 };
    else return {};
  }
}
