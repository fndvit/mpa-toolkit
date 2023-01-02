import { expect } from '@playwright/test';
import { test, gotoAndFailOnError, shouldRedirectToLogin } from '@util';

const ALL_CMS_ENDPOINTS = [
  '/cms',
  '/cms/dump',
  '/cms/pages',
  '/cms/pages/1',
  '/cms/pages/create/chapter',
  '/cms/pages/create/case-study',
  '/cms/tags',
  '/cms/authors',
  '/cms/users',
  '/cms/homepage'
];

ALL_CMS_ENDPOINTS.forEach(url => {
  test.describe(url, () => {
    test('anon should be redirected to login', ({ anonPage: page }) => shouldRedirectToLogin(url, page));

    test('user should be served 403', async ({ userPage: page }) => {
      const response = await page.goto(url);
      expect(response.status()).toBe(403);
    });
  });
});

test.describe('/cms', () => {
  test('should load and have a signout button', async ({ adminPage: page }) => {
    await gotoAndFailOnError('/cms', page);
    expect(page.url()).toMatch(/\/cms$/);
    const buttonEl = await page.$('button');
    expect(await buttonEl.innerText()).toBe('Signout');
  });
});

test.describe('/cms/pages', () => {
  test('should load and list all pages', async ({ adminPage: page }) => {
    await gotoAndFailOnError('/cms/pages', page);
    const ALL_PAGE_TITLES = new Set([
      'Chapter 1',
      'This is a draft chapter',
      'Chapter with all components',
      'Test case study - Empty page for testing'
    ]);
    const pageTitles = new Set(await page.$$eval('.collection-card h1', els => els.map(el => el.textContent)));
    expect(ALL_PAGE_TITLES.size).toBe(pageTitles.size);
    pageTitles.forEach(title => expect(ALL_PAGE_TITLES.has(title)).toBe(true));
  });
});

const BASIC_TEST_CASES = [
  '/cms/dump',
  '/cms/pages/1',
  '/cms/pages/create/chapter',
  '/cms/pages/create/case-study',
  '/cms/tags',
  '/cms/authors',
  '/cms/users',
  '/cms/homepage'
];

BASIC_TEST_CASES.forEach(url => {
  test.describe(url, () => {
    test('loads without error', async ({ adminPage: page }) => {
      await gotoAndFailOnError(url, page);
      expect(page.url()).toMatch(new RegExp(`${url}$`));
    });
  });
});
