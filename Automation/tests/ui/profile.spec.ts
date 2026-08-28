import {
  test,
  expect
} from '../../fixtures/testFixtures.js';

import { ProfilePage } from '../../pages/ProfilePage.js';

test.describe('Profile UI', () => {

  test('should update profile', async ({
    authenticatedPage
  }) => {

    const profile =
      new ProfilePage(authenticatedPage);

    await profile.goto();

    await profile.editProfile(
      'Updated Playwright User',
      '9876543210'
    );

    await expect(
      authenticatedPage.getByText(
        'Profile updated'
      )
    ).toBeVisible();
  });

});