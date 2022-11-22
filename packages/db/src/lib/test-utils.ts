export function generateEmptyPage(type: 'chapter' | 'caseStudy') {
  return {
    title: '',
    slug: '',
    img: '',
    content: { type: 'doc' as const, content: [] },
    tags: [],
    caseStudy:
      type !== 'caseStudy'
        ? undefined
        : {
            name: '',
            established: null,
            size: null,
            governance: '',
            staff: '',
            budget: '',
            budgetLevel: '',
            lat: -90,
            long: 0,
            milestones: {},
            keyLearnings: []
          },
    chapter:
      type !== 'chapter'
        ? undefined
        : {
            summary: '',
            keyTakeaways: [],
            authors: []
          }
  };
}
