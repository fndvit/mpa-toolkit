import type { APIRequests } from '@mpa/db';

export const userHistory = {
  addPageview: (pageId: number) => {
    const pageViews: number[] = JSON.parse(localStorage.getItem('pageViews')) || [];

    if (!pageViews?.includes(pageId)) {
      pageViews.push(pageId);
      localStorage.setItem('pageViews', JSON.stringify(pageViews));
    }
  },
  setMadlibAnswers: (madlibAnswers: APIRequests.Recommendations['madlib']) => {
    localStorage.setItem('madlibAnswers', JSON.stringify(madlibAnswers));
  },
  toApiRequest: (): APIRequests.Recommendations => {
    return {
      pageviews: JSON.parse(localStorage.getItem('pageViews')),
      madlib: JSON.parse(localStorage.getItem('madlibAnswers'))
    };
  }
};
