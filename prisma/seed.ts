import { Tag, TagCategory } from '@prisma/client';
import { PrismaClient, Role, TagType } from '@prisma/client';
import content from './data/content.json';
import tags from './data/tags.json';
import milestones from './data/milestones.json';
import { LoremIpsum } from "lorem-ipsum";
import SeedRandom from 'seedrandom';
import { groupBy } from '../src/lib/helpers/utils';
import { createPage } from '../src/lib/prisma/wrappers';
import type { ContentDocument, PageRequest } from '../src/lib/types';

const seed = 'fixed';
const NUM_RANDOM_CHAPTERS = 20;

const rand = SeedRandom(seed);

const titleLorem = new LoremIpsum({
  seed,
  wordsPerSentence: { min: 10, max: 16 }
});

const summaryLorem = new LoremIpsum({
  seed,
  sentencesPerParagraph: { min: 2, max: 2},
  wordsPerSentence: { min: 10, max: 20 }
});

const getRandItem = <T>(items: T[]): T => getXRandItems(items, 1)[0];

function getXRandItems<T>(items: T[], x: number): T[] {
  const _items = [...items];
  const result = [];
  for (let i = 0; i < x; i++) {
    const index = Math.floor(rand() * _items.length);
    result.push(_items[index]);
    _items.splice(index, 1);
  }
  return result;
}

const prisma = new PrismaClient();

async function main() {

  await prisma.caseStudy.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.tagsOnPages.deleteMany();
  await prisma.page.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tag.deleteMany();

  const names = [ "Emma Doyle", "Nicolas Smith", "Kirby Heath", "Todd Frey", "Del Robertson" ];

  await prisma.user.createMany({
    data: names.map((name, i) => ({
      email: `user${i}@example.com`,
      name,
      role: Role.CONTENT_MANAGER
    }))
  });

  const users = await prisma.user.findMany();
  const userIds = users.map(user => user.id);

  await prisma.tag.createMany({
    data: [
      ...tags.stage.map((value, i) => ({id: i, value, type: TagType.STAGE})),
      ...tags.topic.map(value => ({value, type: TagType.TOPIC})),
      ...tags.user.map(value => ({value, type: TagType.USER})),
    ]
  });

  const allTags = await prisma.tag.findMany();

  await createPage({
    slug: "blue-economy",
    title: "What should MPA managers know about the blue economy and business planning?",
    draft: false,
    img: "img/92a18fa2-b8a3-45ca-8196-0b816644e9d2.jpeg",
    content: content as any as ContentDocument,
    tags: getRandomTagsForContent(allTags),
    chapter: {
      keyTakeaways: [
        summaryLorem.generateSentences(2),
        summaryLorem.generateSentences(2),
        summaryLorem.generateSentences(2),
      ],
      summary: "The blue economy is the use of marine resources for sustainable economic development while improving livelihoods, creating jobs, and protecting and supporting marine ecosystems. Find out how to leverage this for your MPA.",
      authors: [userIds[0]]
    }
  });

  await createPage({
      slug: "raja-ampat-mpa-network-adaptation-strate",
      title: "Raja Ampat MPA Network – Adaptation strategies for a changing climate",
      draft: false,
      img: "img/92a18fa2-b8a3-45ca-8196-0b816644e9d2.jpeg",
      content: content as any as ContentDocument,
      tags: getRandomTagsForContent(allTags),
      caseStudy: {
        name: "Raja Ampat MPA Network",
        established: 2008,
        size: 20002,
        governance: "Co-management with the regional public service agency",
        staff: "56 workers",
        budget: "Entrance fees (87–88%) + grants (11–12%):US$1,470,000. The pandemic caused a drastic reduction in 2020/2021.",
        budgetLevel: "Between basic (IDR 13-14 billion ~ US$950,000) and optimal (IDR 30 billion ~ US$2.1 million)",
        lat: -0.23333324,
        long: 130.51666646,
        milestones
      }
  });

  for (let i = 0; i < NUM_RANDOM_CHAPTERS; i++) {
    await createRandomPage(userIds, allTags);
  }

}

function getRandomTagsForContent(allTags: Tag[]): PageRequest['tags'] {
  const NUM_TAGS = {
    primary: 2,
    secondary: 4,
    topic: 3,
    user: 3
  };
  const tags = groupBy(allTags, t => t.type);
  return [
    ...getXRandItems(tags.STAGE, NUM_TAGS.primary + NUM_TAGS.secondary)
      .map((t, i) => ({
        id: t.id,
        category: i < NUM_TAGS.primary ? TagCategory.PRIMARY : TagCategory.SECONDARY
      })),
    ...getXRandItems(tags.TOPIC, NUM_TAGS.topic).map(t => ({id: t.id, category: TagCategory.PRIMARY})),
    ...getXRandItems(tags.USER, NUM_TAGS.user).map(t => ({id: t.id, category: TagCategory.PRIMARY})),
  ];
}

async function createRandomPage(userIds: number[], allTags: Tag[]) {
  const title = titleLorem.generateSentences(1);
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
  const summary = summaryLorem.generateParagraphs(1);

  await createPage({
    slug, title,
    draft: false,
    img: "img/92a18fa2-b8a3-45ca-8196-0b816644e9d2.jpeg",
    content: content as any as ContentDocument,
    tags: getRandomTagsForContent(allTags),
    chapter: {
      summary,
      authors: getXRandItems(userIds, Math.ceil(Math.random() * 2)),
      keyTakeaways: Array(Math.floor(Math.random() * 4)).fill(null).map(() => summaryLorem.generateSentences(2))
    }
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });