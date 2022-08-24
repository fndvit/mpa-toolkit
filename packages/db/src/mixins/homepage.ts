import { publishEvent } from '@mpa/events';
import type { MpaDatabase } from '../db';
import { createKeyValueAccessor } from '../lib/kvaccessor';
import type { APIRequests, HomepageComponents } from '../types';
import { validate } from '../validation';

export const homepageMixin = (db: MpaDatabase) => {
  const homepageAccessor = createKeyValueAccessor<HomepageComponents>('homepage-components', db);
  const DEFAULT_ORDERING: HomepageComponents = ['lifecycle', 'chapters', 'search', 'madlib', 'casestudies'];
  return {
    updateComponents: async (value: APIRequests.HomepageComponents) => {
      validate('homepage-components', value);
      const val = await homepageAccessor.upsert(value);
      await publishEvent('homepage-components-updated');
      return val;
    },
    getComponents: async () => (await homepageAccessor.get()) || DEFAULT_ORDERING
  };
};
