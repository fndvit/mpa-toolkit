import { expect } from '@playwright/test';
import { test, gotoAndFailOnError } from '@util';

test('loads for admin', async ({ adminPage: page }) => {
  await gotoAndFailOnError('/', page);
  await expect(page).toHaveTitle(/^MPAth\b/);
});

test('loads for anon', async ({ anonPage: page }) => {
  await gotoAndFailOnError('/', page);
  await expect(page).toHaveTitle(/^MPAth\b/);
});
