import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { test, gotoAndFailOnError, shouldRedirectToLogin } from '@util';

test.describe('live chapter', () => {
  test('loads', async ({ anonPage, adminPage }) => {
    for (const page of [anonPage, adminPage]) {
      await gotoAndFailOnError('/chapter-1', page);
      await expect(page).toHaveTitle(/\bChapter 1\b/);
    }
  });

  test("draft doesn't render on live endpoint", async ({ anonPage, adminPage }) => {
    for (const page of [anonPage, adminPage]) {
      const response = await page.goto('/this-is-a-draft-chapter');
      expect(response.status()).toBe(404);
    }
  });
});

test('draft chapter', async ({ adminPage: page }) => {
  await gotoAndFailOnError('/draft/this-is-a-draft-chapter', page);
  await expect(page).toHaveTitle(/\bThis is a draft chapter\b/);
});

test('draft not visible to anon', async ({ anonPage: page }) => {
  await shouldRedirectToLogin('/draft/this-is-a-draft-chapter', page);
});

test('live case study', async ({ anonPage: page }) => {
  await gotoAndFailOnError('/test-case-study', page);
  await expect(page).toHaveTitle(/\bTest case study\b/);
});

test.describe('page components', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await gotoAndFailOnError('/chapter-with-all-components', page);
  });

  test.afterAll(() => page.close());

  test('page title to correctly contain the title', async () => {
    expect(await page.title()).toMatch(/\bChapter with all components\b/);
  });

  test('link cards should render correct urls', async () => {
    const hrefs = await page.$$eval('.linkcards a', els => els.map(el => el.getAttribute('href')));
    expect(hrefs).toEqual(['https://disney.co.uk', 'https://www.theguardian.com', 'https://www.un.org']);
  });

  test('image should have alt text', async () => {
    const altText = await page.$eval('.image img', el => el.getAttribute('alt'));
    expect(altText).toBe('llama');
  });
});
