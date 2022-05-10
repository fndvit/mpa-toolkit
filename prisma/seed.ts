import Prisma from '@prisma/client';
import content from './data/content.json' assert {type: "json"};
import tags from './data/tags.json' assert {type: "json"};
import milestones from './data/milestones.json' assert {type: "json"};

const { PrismaClient, Role, TagType } = Prisma;

const prisma = new PrismaClient();

async function main() {

  await prisma.caseStudy.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.tagsOnPages.deleteMany();
  await prisma.page.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tag.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: "user@example.com",
      role: Role.CONTENT_MANAGER,
      name: "Emma Doyle"
    }
  });

  await prisma.tag.createMany({
    data: [
      ...tags.stage.map((value, i) => ({id: i, value, type: TagType.STAGE})),
      ...tags.topic.map(value => ({value, type: TagType.TOPIC})),
      ...tags.user.map(value => ({value, type: TagType.USER})),
    ]
  });

  await prisma.page.create({
    data: {
      slug: "blue-economy",
      title: "What should MPA managers know about the blue economy and business planning?",
      draft: false,
      img: "img/92a18fa2-b8a3-45ca-8196-0b816644e9d2.jpeg",
      content,
      tags: {
        createMany: {
          data: [
            { tagId: 1, category: 'PRIMARY' },
            { tagId: 2, category: 'PRIMARY' },
            { tagId: 3, category: 'SECONDARY' },
            { tagId: 4, category: 'SECONDARY' },
          ]
        }
      },
      chapter: {
        create: {
          summary: "The blue economy is the use of marine resources for sustainable economic development while improving livelihoods, creating jobs, and protecting and supporting marine ecosystems. Find out how to leverage this for your MPA.",
          authors: { connect: [{ id: user.id }] }
        }
      }
    }
  });

  await prisma.page.create({
    data: {
      slug: "raja-ampat-mpa-network-adaptation-strate",
      title: "Raja Ampat MPA Network – Adaptation strategies for a changing climate",
      draft: false,
      img: "img/92a18fa2-b8a3-45ca-8196-0b816644e9d2.jpeg",
      content,
      caseStudy: {
        create: {
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
      }
    }
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });