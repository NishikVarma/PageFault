import {test, expect, Page} from '@playwright/test';

test('My first test', async ({page}) => {
    await page.goto("https://www.google.com");
    await expect(page).toHaveTitle('Google');
})