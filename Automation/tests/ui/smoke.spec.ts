import {
  test,
  expect
} from '@playwright/test';

test.describe('Smoke Tests', () => {

  test('application should load', async ({
    page
  }) => {

    await page.goto('/');

    await expect(
      page.getByText('PureBasket')
    ).toBeVisible();
  });


  test('login page should load', async ({
    page
  }) => {

    await page.goto('/login');

    await expect(
      page.getByRole('heading', {
        name: 'Welcome Back'
      })
    ).toBeVisible();
  });


  test('register page should load', async ({
    page
  }) => {

    await page.goto('/register');

    await expect(
      page.getByRole('heading', {
        name: 'Create Account'
      })
    ).toBeVisible();
  });

});