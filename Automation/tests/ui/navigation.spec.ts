import {
  test,
  expect
} from '@playwright/test';

test.describe('Navigation', () => {

  test('logged out user should see login/register', async ({
    page
  }) => {

    await page.goto('/');

    await expect(
      page.getByRole(
        'link',
        { name: 'Login' }
      )
    ).toBeVisible();

    await expect(
      page.getByRole(
        'link',
        { name: 'Register' }
      )
    ).toBeVisible();
  });


  test('should navigate to login', async ({
    page
  }) => {

    await page.goto('/');

    await page.getByRole(
      'link',
      { name: 'Login' }
    ).click();

    await expect(page).toHaveURL(
      /\/login/
    );
  });


  test('should navigate to register', async ({
    page
  }) => {

    await page.goto('/');

    await page.getByRole(
      'link',
      { name: 'Register' }
    ).click();

    await expect(page).toHaveURL(
      /\/register/
    );
  });

});