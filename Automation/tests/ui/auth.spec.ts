import {
  test,
  expect
} from '@playwright/test';

import {
  uniqueEmail,
  testPassword
} from '../../utils/testData.js';

import {
  RegisterPage
} from '../../pages/RegisterPage.js';

import {
  LoginPage
} from '../../pages/LoginPage.js';

test.describe('Authentication UI', () => {

  test('should register successfully', async ({
    page
  }) => {

    const registerPage =
      new RegisterPage(page);

    const email =
      uniqueEmail();

    await registerPage.goto();

    await registerPage.register(
      'Playwright User',
      email,
      testPassword
    );

    await expect(page)
      .toHaveURL(/\/$/);
  });


  test('should login successfully', async ({
    page
  }) => {

    const email =
      uniqueEmail();

    const response =
      await page.request.post(
        'http://localhost:5001/api/auth/register',
        {
          data: {
            name: 'UI Login User',
            email,
            password: testPassword
          }
        }
      );

    expect(
      response.status()
    ).toBe(201);

    const loginPage =
      new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      email,
      testPassword
    );

    await expect(page)
      .toHaveURL(/\/$/);

    await expect(
      page.getByText(
        'Hi, UI Login User'
      )
    ).toBeVisible();
  });


  test('should show error for invalid login', async ({
    page
  }) => {

    const loginPage =
      new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      'doesnotexist@example.com',
      'WrongPassword'
    );

    await loginPage.expectLoginError(
      'Invalid credentials'
    );
  });

});