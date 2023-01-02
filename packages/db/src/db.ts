import { BaseDatabase } from './base';
import { AuthorMixin } from './mixins/author';
import { HomepageMixin } from './mixins/homepage';
import { PageMixin } from './mixins/page';
import { SessionMixin } from './mixins/session';
import { TagMixin } from './mixins/tag';
import { UserMixin } from './mixins/user';

export const initDatabase = () =>
  BaseDatabase.createWithMixins({ mixins: [TagMixin, UserMixin, AuthorMixin, HomepageMixin, PageMixin, SessionMixin] });

export type MpaDatabase = ReturnType<typeof initDatabase>;
