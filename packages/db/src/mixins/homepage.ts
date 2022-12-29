import { publishEvent } from '@mpa/events';
import type { LogConfig } from '../base';
import { DBMixin } from '../base';
import { createKeyValueAccessor } from '../lib/kvaccessor';
import type { APIRequests, HomepageComponents } from '../types';
import { validate } from '../validation';

export class HomepageMixin extends DBMixin {
  readonly name = 'homepage';

  logConfig: LogConfig<HomepageMixin> = {
    updateComponents: ([val], result) => [val, !!result]
  };

  homepageAccessor = createKeyValueAccessor<HomepageComponents>('homepage-components', this.db);
  static DEFAULT_ORDERING: HomepageComponents = ['lifecycle', 'chapters', 'search', 'madlib', 'casestudies'];

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
