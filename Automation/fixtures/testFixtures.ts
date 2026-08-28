import {
  test as base,
  expect,
  Page
} from '@playwright/test';

import {
  uniqueEmail,
  testPassword
} from '../utils/testData.js';

type TestFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<TestFixtures>({
  authenticatedPage: async ({ page, request }, use) => {

    const email = uniqueEmail();

    // Register test user through the backend
    const registerResponse = await request.post(
      'http://localhost:5001/api/auth/register',
      {
        data: {
          name: 'Playwright Test User',
          email,
          password: testPassword
        }
      }
    );

    expect(registerResponse.status()).toBe(201);

    // Open frontend login page
    await page.goto('/login');

    await page
      .locator('input[type="email"]')
      .fill(email);

    await page
      .locator('input[type="password"]')
      .fill(testPassword);

    await page
      .getByRole('button', {
        name: /login/i
      })
      .click();

    await expect(page).toHaveURL(/\/$/);

    await use(page);
  }
});

export { expect };