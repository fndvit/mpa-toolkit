import { readFileSync } from 'fs';
import Prisma from '@prisma/client';

const { PrismaClient, Role } = Prisma;

const prisma = new PrismaClient();

async function main() {

  await prisma.caseStudy.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.page.deleteMany();
  await prisma.user.deleteMany();

  const content = await readFileSync('./prisma/content.json', { encoding: 'utf8' });
  const contentJson = JSON.parse(content);

  const milestones = await readFileSync('./prisma/milestones.json', { encoding: 'utf8' });
  const milestonesJson = JSON.parse(milestones);

  const user = await prisma.user.create({
    data: {
      email: "user@example.com",
      role: Role.CONTENT_MANAGER,
      name: "Emma Doyle"
    }
  });

  const page = await prisma.page.create({
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

  const caseStudyPage = await prisma.page.create({
    data: {
      slug: "raja-ampat-mpa-network-adaptation-strate",
      title: "Raja Ampat MPA Network – Adaptation strategies for a changing climate",
      draft: false,
      img: "img/92a18fa2-b8a3-45ca-8196-0b816644e9d2.jpeg",
      content: contentJson,
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
          milestones: milestonesJson
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