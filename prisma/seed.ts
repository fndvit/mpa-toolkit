import { readFileSync } from 'fs';
import Prisma from '@prisma/client';

const { PrismaClient, Role } = Prisma;

const prisma = new PrismaClient();

async function main() {

  await prisma.caseStudy.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.page.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tagsOnPages.deleteMany();
  await prisma.tag.deleteMany();

  const content = await readFileSync('./prisma/content.json', { encoding: 'utf8' });
  const contentJson = JSON.parse(content);
  const tags = await readFileSync('./prisma/tags.json', { encoding: 'utf8' });
  const tagsJson = JSON.parse(tags);

  const user = await prisma.user.create({
    data: {
      email: "user@example.com",
      role: Role.CONTENT_MANAGER,
      name: "Emma Doyle"
    }
  });

  await prisma.page.create({
    data: {
      slug: "blue-economy",
      title: "What should MPA managers know about the blue economy and business planning?",
      draft: false,
      img: "img/92a18fa2-b8a3-45ca-8196-0b816644e9d2.jpeg",
      content: contentJson,
      chapter: {
        create: {
          summary: "The blue economy is the use of marine resources for sustainable economic development while improving livelihoods, creating jobs, and protecting and supporting marine ecosystems. Find out how to leverage this for your MPA.",
          authors: {
            connect: [{
              id: user.id
            }]
          }
        }
      }
    }
  });

  await prisma.tag.createMany({
    data: [
      ...tagsJson.stage.map((value, i) => ({id: i, value, type: Prisma.TagType.STAGE})),
      ...tagsJson.topic.map(value => ({value, type: Prisma.TagType.TOPIC})),
      ...tagsJson.user.map(value => ({value, type: Prisma.TagType.USER})),
    ]
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });