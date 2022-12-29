import { publishEvent } from '@mpa/events';
import { slugify } from '@mpa/utils';
import type { LogConfig } from '../base';
import { DBMixin } from '../base';
import * as Queries from '../queries';
import type { APIRequests, Tag, TagType } from '../types';
import { validate } from '../validation';

export class TagMixin extends DBMixin {
  readonly name = 'tag';
  logConfig: LogConfig<TagMixin> = {
    create: ([tag], result) => [tag.value, result?.id],
    update: ([id, tag], result) => [[id, tag.value], !!result],
    delete: ([id], result) => [id, result]
  };

  all = async (tagType?: TagType): Promise<Tag[]> =>
    tagType ? this.db.prisma.tag.findMany({ where: { type: tagType } }) : this.db.prisma.tag.findMany();

  async get(idOrSlug: string | number): Promise<Tag>;
  async get(slugs: string[]): Promise<Tag[]>;
  async get(val: number | string | string[]) {
    if (typeof val === 'number') {
      return this.db.prisma.tag.findUnique({ where: { id: val } });
    } else {
      // can't directly query db by slug using prisma
      const allTags = await this.all();
      if (Array.isArray(val)) {
        return allTags.filter(tag => val.includes(slugify(tag.value)));
      } else if (typeof val === 'string') {
        return allTags.find(t => slugify(t.value) === val);
      }
    }
    return null;
  }

  async getIds(idOrSlug: number | string): Promise<number>;
  async getIds(slugs: string[]): Promise<number[]>;
  async getIds(val: number | string | string[]) {
    if (Array.isArray(val)) return this.get(val).then(tags => tags.map(t => t.id));
    else return this.get(val).then(t => t.id);
  }

  searchBarTags(): Promise<Tag[]> {
    return this.db.prisma.tag.findMany({
      ...Queries.tag,
      where: {
        type: 'TOPIC',
        pageTags: { some: { page: { draft: false } } }
      },
      orderBy: { pageTags: { _count: 'desc' } },
      take: 10
    });
  }

  async update(id: number, tag: APIRequests.Tag) {
    validate('tag', tag);

    const _typeCheckTag = await this.db.prisma.tag.findFirst({ where: { id }, select: { type: true } });
    if (!_typeCheckTag) throw new Error(`Tag not found with id ${id}`);
    if (_typeCheckTag.type !== 'TOPIC') throw new Error('Only topic tags can be updated');

    const updateTagQuery = this.db.prisma.tag.update({ where: { id }, data: { value: tag.value } });

    //update all tag search indexes from all tagsonpages tags
    const createPageSearchIndex = this.db.prisma
      .$queryRaw`SELECT CAST (create_page_search_index("pageId") AS TEXT) FROM "TagsOnPages" WHERE "tagId" = ${id};`;

    const [_tag] = await this.db.prisma.$transaction([updateTagQuery, createPageSearchIndex]);

    await publishEvent('tag-updated', { id });

    return _tag;
  }

  allForCms() {
    return this.db.prisma.tag.findMany({
      where: { type: 'TOPIC' },
      ...Queries.countTags,
      orderBy: {
        value: 'asc'
      }
    });
  }

  async allForRecommender() {
    const query = await this.db.prisma.tag.findMany({
      ...Queries.countTags,
      orderBy: {
        value: 'asc'
      }
    });
    return query.map(({ id, value, _count }) => ({ id, value, pageCount: _count.pageTags }));
  }

  async delete(id: number) {
    const tag = await this.db.prisma.tag.findFirst({ where: { id } });
    if (!tag) throw new Error(`Tag not found with id ${id}`);
    if (tag.type !== 'TOPIC') throw new Error('Only topic tags can be deleted');
    const cascade = this.db.prisma.tagsOnPages.deleteMany({ where: { tagId: id } });
    const deleteTag = this.db.prisma.tag.delete({ where: { id } });
    await this.db.prisma.$transaction([cascade, deleteTag]);
    await publishEvent('tag-deleted', { id });
    return true;
  }

  async create(tag: APIRequests.Tag) {
    validate('tag', tag);
    const createTagQuery = this.db.prisma.tag.create({ data: { value: tag.value, type: 'TOPIC' } });
    const [_tag] = await this.db.prisma.$transaction([createTagQuery]);
    await publishEvent('tag-created', { id: _tag.id });
    return _tag;
  }

  async search(searchText: string) {
    const results: { tagId: number; highlight: string }[] = await this.db.prisma
      .$queryRaw`SELECT * FROM tag_highlights(${searchText})`;
    const o = Object.fromEntries(results.map(r => [r.tagId, r.highlight])) as { [tagId: number]: string };
    return o;
  }
}
