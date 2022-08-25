import type { Tag } from '@prisma/client';
import { TagCategory, TagType } from '@prisma/client';
import { LoremIpsum } from 'lorem-ipsum';
import SeedRandom from 'seedrandom';
import { groupBy } from '@mpa/utils';
import type { ContentBlock, ContentDocument, APIRequests, ParagraphBlock } from '../types';
import type { MpaDatabase } from '../db';
import content from './data/content.json';
import page1 from './data/pages/page1.json';
import page2 from './data/pages/page2.json';
import page3 from './data/pages/page3.json';
import tags from './data/tags.json';
import milestones from './data/milestones.json';
import keyLearnings from './data/keyLearnings.json';

export class Seeder {
  static FIXED_SEED = 'fixed';
  static NUM_RANDOM_CHAPTERS = 50;

  db: MpaDatabase;

  constructor(db: MpaDatabase) {
    this.db = db;
  }

  rand = SeedRandom(Seeder.FIXED_SEED);

  titleLorem = new LoremIpsum({
    seed: Seeder.FIXED_SEED,
    wordsPerSentence: { min: 10, max: 16 }
  });

  headingLorem = new LoremIpsum({
    seed: Seeder.FIXED_SEED,
    wordsPerSentence: { min: 2, max: 4 }
  });

  summaryLorem = new LoremIpsum({
    seed: Seeder.FIXED_SEED,
    sentencesPerParagraph: { min: 2, max: 2 },
    wordsPerSentence: { min: 10, max: 20 }
  });

  paragraphLorem = new LoremIpsum({
    seed: Seeder.FIXED_SEED,
    sentencesPerParagraph: { min: 3, max: 5 },
    wordsPerSentence: { min: 10, max: 20 }
  });

  randInt = (min: number, max: number) => Math.floor(this.rand() * (max - min + 1)) + min;

  getRandItem = <T>(items: T[]): T => this.getXRandItems(items, 1)[0];

  getXRandItems<T>(items: T[], x: number): T[] {
    const _items = [...items];
    const result: T[] = [];
    for (let i = 0; i < x; i++) {
      const index = Math.floor(this.rand() * _items.length);
      result.push(_items[index]);
      _items.splice(index, 1);
    }
    return result;
  }

  generateRandomContent = (): ContentDocument => ({
    type: 'doc',
    content: new Array(this.randInt(1, 3))
      .fill(0)
      .map<ContentBlock[]>(() => [
        {
          type: 'heading',
          attrs: { level: 1, showmore: 'Show more on this topic' },
          content: [{ text: this.headingLorem.generateSentences(1), type: 'text' }]
        },
        ...new Array(this.randInt(1, 3)).fill(0).map<ParagraphBlock>(() => ({
          type: 'paragraph',
          content: [{ text: this.paragraphLorem.generateParagraphs(1), type: 'text' }]
        }))
      ])
      .flat()
  });

  async createTags() {
    await this.db.prisma.tag.createMany({
      data: [
        ...tags.stage.map((value, i) => ({ id: i, value, type: TagType.STAGE })),
        ...tags.topic.map(value => ({ value, type: TagType.TOPIC })),
        ...tags.user.map(value => ({ value, type: TagType.USER }))
      ],
      skipDuplicates: true
    });
  }

  async createDevData() {
    const names = ['Emma Doyle', 'Nicolas Smith', 'Kirby Heath', 'Todd Frey', 'Del Robertson'];

    await this.db.prisma.author.createMany({
      data: names.map(name => ({
        name,
        bio: this.summaryLorem.generateParagraphs(1)
      }))
    });

    const authors = await this.db.prisma.author.findMany();
    const authorIds = authors.map(a => a.id);

    const allTags = await this.db.prisma.tag.findMany();

    await this.db.page.create({ ...page1, content: page1.content as ContentDocument });
    await this.db.page.create({ ...page2, content: page2.content as ContentDocument });
    await this.db.page.create({ ...page3, content: page3.content as ContentDocument });

    await this.db.page.create({
      slug: 'blue-economy',
      title: 'What should MPA managers know about the blue economy and business planning?',
      draft: false,
      img: 'img/92a18fa2-b8a3-45ca-8196-0b816644e9d2.jpeg',
      content: content as ContentDocument,
      tags: this.getRandomTagsForContent(allTags),
      chapter: {
        keyTakeaways: [
          this.summaryLorem.generateSentences(2),
          this.summaryLorem.generateSentences(2),
          this.summaryLorem.generateSentences(2)
        ],
        summary:
          'The blue economy is the use of marine resources for sustainable economic development while improving livelihoods, creating jobs, and protecting and supporting marine ecosystems. Find out how to leverage this for your MPA.',
        authors: [authorIds[0]]
      }
    });

    await this.db.page.create({
      slug: 'raja-ampat-mpa-network-adaptation-strate',
      title: 'Adaptation strategies for a changing climate',
      draft: false,
      img: 'img/92a18fa2-b8a3-45ca-8196-0b816644e9d2.jpeg',
      content: content as ContentDocument,
      tags: this.getRandomTagsForContent(allTags),
      caseStudy: {
        name: 'Raja Ampat MPA Network',
        established: 2008,
        size: 20002,
        governance: 'Co-management with the regional public service agency',
        staff: '56 workers',
        budget:
          'Entrance fees (87–88%) + grants (11–12%):US$1,470,000. The pandemic caused a drastic reduction in 2020/2021.',
        budgetLevel: 'Between basic (IDR 13-14 billion ~ US$950,000) and optimal (IDR 30 billion ~ US$2.1 million)',
        lat: -0.23333324,
        long: 130.51666646,
        milestones,
        keyLearnings
      }
    });

    for (let i = 0; i < Seeder.NUM_RANDOM_CHAPTERS; i++) {
      await this.createRandomPage(authorIds, allTags);
    }
  }

  async seed(dev: boolean) {
    console.log(`Seeding: ${dev ? 'dev' : 'prod'}`);

    const tables = ['search', 'caseStudy', 'chapter', 'tagsOnPages', 'page', 'user', 'tag'];
    for (const table of tables) {
      console.log(`Clearing table "${table}"...`);
      await this.db.prisma[table].deleteMany();
    }

    console.log('Creating tags...');
    await this.createTags();

    console.log('Creating homepage components...');
    await this.db.homepage.updateComponents(['lifecycle', 'chapters', 'search', 'madlib', 'casestudies']);

    if (dev) {
      console.log('Creating dev data...');
      await this.createDevData();
    }

    console.log('Finished');
  }

  async migrate() {
    console.log('Creating tags...');
    await this.db.prisma.tag.createMany({
      data: [
        ...tags.stage.map((value, i) => ({ id: i, value, type: TagType.STAGE })),
        ...tags.user.map(value => ({ value, type: TagType.USER }))
      ],
      skipDuplicates: true
    });
  }

  getRandomTagsForContent(allTags: Tag[]): APIRequests.Page['tags'] {
    const NUM_TAGS = {
      primary: 2,
      secondary: 4,
      topic: 6,
      user: 3
    };
    const tags = groupBy(allTags, t => t.type);
    return [
      ...this.getXRandItems(tags.STAGE!, NUM_TAGS.primary + NUM_TAGS.secondary).map((t, i) => ({
        id: t.id,
        category: i < NUM_TAGS.primary ? TagCategory.PRIMARY : TagCategory.SECONDARY
      })),
      ...this.getXRandItems(tags.TOPIC!, NUM_TAGS.topic).map(t => ({ id: t.id, category: TagCategory.PRIMARY })),
      ...this.getXRandItems(tags.USER!, NUM_TAGS.user).map(t => ({ id: t.id, category: TagCategory.PRIMARY }))
    ];
  }

  async createRandomPage(authorIds: number[], allTags: Tag[]) {
    const title = this.titleLorem.generateSentences(1);
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 40);
    const summary = this.summaryLorem.generateParagraphs(1);
    const pageType = this.rand() < 0.2 ? 'case study' : 'chapter';

    await this.db.page.create({
      slug,
      title,
      draft: false,
      img: 'img/92a18fa2-b8a3-45ca-8196-0b816644e9d2.jpeg',
      content: this.generateRandomContent(),
      tags: this.getRandomTagsForContent(allTags),
      caseStudy:
        pageType !== 'case study'
          ? undefined
          : {
              name: this.headingLorem.generateSentences(1),
              established: 2000,
              size: 100,
              governance: '',
              staff: '',
              budget: '',
              budgetLevel: '',
              lat: this.rand() * 180 - 90,
              long: this.rand() * 360 - 180,
              milestones: { '2000': [this.titleLorem.generateSentences(1)] },
              keyLearnings: [
                {
                  subject: 'What works',
                  body: [
                    this.titleLorem.generateSentences(1),
                    this.titleLorem.generateSentences(1),
                    this.titleLorem.generateSentences(1)
                  ]
                },
                {
                  subject: "What doesn't work",
                  body: [
                    this.titleLorem.generateSentences(1),
                    this.titleLorem.generateSentences(1),
                    this.titleLorem.generateSentences(1)
                  ]
                }
              ]
            },
      chapter:
        pageType !== 'chapter'
          ? undefined
          : {
              summary,
              authors: this.getXRandItems(authorIds, Math.ceil(Math.random() * 2)),
              keyTakeaways: Array(Math.floor(Math.random() * 4))
                .fill(null)
                .map(() => this.summaryLorem.generateSentences(2))
            }
    });
  }
}
