import { TagType } from '@prisma/client';
import type { MpaDatabase } from '../db';
import tags from './data/tags.json';

export class DbSeeder {
  constructor(public db: MpaDatabase) {}

  createBaseTags = async () => {
    const invalidTags = await this.db.prisma.tag.findMany({
      where: {
        OR: [
          { type: TagType.STAGE, value: { notIn: tags.stage } },
          { type: TagType.USER, value: { notIn: tags.user } }
        ]
      }
    });

    if (invalidTags.length > 0) {
      console.log(`Deleting ${invalidTags.length} invalid tags: ${invalidTags.map(t => t.value).join(', ')}`);
      await this.db.prisma.tagsOnPages.deleteMany({
        where: {
          tagId: { in: invalidTags.map(t => t.id) }
        }
      });
      await this.db.prisma.tag.deleteMany({
        where: {
          id: { in: invalidTags.map(t => t.id) }
        }
      });
    }

    return this.db.prisma.tag.createMany({
      data: [
        ...tags.stage.map((value, i) => ({ id: i, value, type: TagType.STAGE })),
        ...tags.user.map(value => ({ value, type: TagType.USER }))
      ],
      skipDuplicates: true
    });
  };

  createHomepageComponents = () =>
    this.db.homepage.updateComponents(['lifecycle', 'chapters', 'search', 'madlib', 'casestudies']);

  async migrate() {
    console.log('Creating base tags...');
    await this.createBaseTags();
  }
}
