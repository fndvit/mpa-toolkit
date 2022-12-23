import type { Browser, Response } from '@playwright/test';
import { type Page, test as _test, expect } from '@playwright/test';

const SESSION_COOKIE_VALUES = {
  ADMIN: 'admin-session',
  CONTENT_MANAGER: 'cms-session',
  USER: 'user-session'
};

export async function shouldRedirectToLogin(url: string, page: Page) {
  await page.goto(url);
  const title = await page.title();
  expect(title).toMatch(/\bLogin\b/);
  expect(page.url()).toMatch(/\/cms\/login\b/);
}

export async function gotoAndFailOnError(url: string, page: Page) {
  // fail on non-200 responses and fail on javascript errors
  return new Promise<Response>((resolve, reject) => {
    const responsePromise = page.goto(url);
    page.on('pageerror', error => reject(error));
    page.on('load', async () => {
      await page.waitForLoadState('networkidle');
      resolve(responsePromise);
    });
    responsePromise.then(response => _test.expect(response.status()).toBe(200));
  });
}

async function createForUser(userType: keyof typeof SESSION_COOKIE_VALUES, browser: Browser) {
  const context = await browser.newContext();
  const cookieVal = SESSION_COOKIE_VALUES[userType];
  await context.addCookies([
    { name: 'session', domain: 'localhost', path: '/', value: cookieVal, httpOnly: true, sameSite: 'Lax', expires: -1 }
  ]);
  return context.newPage();
}

type MyFixtures = {
  adminPage: Page;
  contentManagerPage: Page;
  userPage: Page;
  anonPage: Page;
};

export const test = _test.extend<MyFixtures>({
  adminPage: ({ browser }, use) => createForUser('ADMIN', browser).then(page => use(page)),
  contentManagerPage: ({ browser }, use) => createForUser('CONTENT_MANAGER', browser).then(page => use(page)),
  userPage: ({ browser }, use) => createForUser('USER', browser).then(page => use(page)),
  anonPage: ({ browser }, use) => browser.newPage().then(page => use(page))
});
