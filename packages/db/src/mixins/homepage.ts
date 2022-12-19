import { publishEvent } from '@mpa/events';
import type { MpaDatabase } from '../db';
import { createKeyValueAccessor } from '../lib/kvaccessor';
import type { APIRequests, HomepageComponents } from '../types';
import { validate } from '../validation';
import type { LogConfig } from './mixin';
import { DBMixin } from './mixin';

export class HomepageMixin extends DBMixin {
  homepageAccessor = createKeyValueAccessor<HomepageComponents>('homepage-components', this.db);
  static DEFAULT_ORDERING: HomepageComponents = ['lifecycle', 'chapters', 'search', 'madlib', 'casestudies'];

  constructor(db: MpaDatabase) {
    const logCfg: LogConfig<HomepageMixin> = {
      updateComponents: ([val], result) => [val, !!result]
    };
    super('homepage', db, logCfg);
  }

  async updateComponents(value: APIRequests.HomepageComponents) {
    validate('homepage-components', value);
    const val = await this.homepageAccessor.upsert(value);
    await publishEvent('homepage-components-updated');
    return val;
  }

  async getComponents() {
    return (await this.homepageAccessor.get()) || HomepageMixin.DEFAULT_ORDERING;
  }
}
