import type { APIRequests } from '@mpa/db';

export const userHistory = {
  addPageview: (pageId: number) => {
    // eslint-disable-next-line prefer-const
    let pageViews: number[] = JSON.parse(localStorage.getItem('pageViews')) || [];

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
      // TODO: return a JSON object that we can submit to the recommendation API endpoint
      pageviews: JSON.parse(localStorage.getItem('pageViews')),
      madlib: JSON.parse(localStorage.getItem('madlibAnswers'))
    };
  }
};
