import { expect } from '@playwright/test';
import { test, gotoAndFailOnError } from '@util';

test.describe('metadata', () => {
  // run these only on one browser
  test.skip(({ browserName }) => browserName !== 'chromium');

  const ALL_URLS = [
    '/',
    '/chapter-1', // '/[slug]',
    '/tag/some-tag', // '/tag/[slug]',
    '/search',
    '/author/test-author', // '/author/[slug]',
    '/team',
    '/partners',
    '/privacy-policy',
    '/terms-of-use',
    '/sitemap',
    '/cms',
    '/cms/login',
    '/cms/dump',
    '/cms/pages',
    '/cms/tags',
    '/cms/users',
    '/cms/authors',
    '/cms/homepage',
    '/cms/pages/1', // '/cms/pages/[id]',
    '/cms/pages/create/chapter',
    '/cms/pages/create/case-study',
    '/draft/this-is-a-draft-chapter' // '/draft/[slug]'
  ];

  for (const url of ALL_URLS) {
    test(url, async ({ adminPage: page }) => {
      await gotoAndFailOnError(url, page);
      const hasMetadataWarning = await page.$$eval('.metadata-warning', el => el.length > 0);
      expect(hasMetadataWarning).toBe(false);

      const title = await page.$eval('title', el => el.textContent);
      expect(title).not.toBe('');
    });
  }
});
