import {
  test,
  expect
} from '../../fixtures/testFixtures.js';

test('user should be able to logout', async ({
  authenticatedPage
}) => {

  await authenticatedPage
    .getByRole('button', {
      name: 'Logout'
    })
    .click();

  await expect(
    authenticatedPage.getByRole(
      'link',
      { name: 'Login' }
    )
  ).toBeVisible();

  await expect(
    authenticatedPage.getByRole(
      'link',
      { name: 'Register' }
    )
  ).toBeVisible();
});