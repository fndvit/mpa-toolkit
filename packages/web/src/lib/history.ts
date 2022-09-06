import type { APIRequests } from '@mpa/db';

export const userHistory = {
  addPageview: (pageId: number) => {
    // TODO: add pageid to the pageview history
  },
  setMadlibAnswers: (/*...args*/) => {
    // TODO: update the user's madlib answers
  },
  toApiRequest: (): APIRequests.Recommendations => {
    return {
      // TODO: return a JSON object that we can submit to the recommendation API endpoint
      pageviews: [],
      madlib: []
    };
  }
};
