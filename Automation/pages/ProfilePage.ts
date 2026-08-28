import {
  Page,
  Locator,
  expect
} from '@playwright/test';

export class ProfilePage {
  private readonly page: Page;

  readonly editButton: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly nameInput: Locator;
  readonly phoneInput: Locator;

  constructor(page: Page) {
    this.page = page;

    this.editButton =
      this.page.getByRole('button', {
        name: 'Edit Profile'
      });

    this.saveButton =
      this.page.getByRole('button', {
        name: 'Save'
      });

    this.cancelButton =
      this.page.getByRole('button', {
        name: 'Cancel'
      });

    this.nameInput =
      this.page.locator('input').nth(0);

    this.phoneInput =
      this.page.locator('input').nth(2);
  }

  async goto(): Promise<void> {
    await this.page.goto('/profile');
  }

  async editProfile(
    name: string,
    phone: string
  ): Promise<void> {
    await this.editButton.click();

    await this.nameInput.fill(name);

    await this.phoneInput.fill(phone);

    await this.saveButton.click();
  }

  async cancelEditing(): Promise<void> {
    await this.cancelButton.click();
  }

  async expectProfileVisible(): Promise<void> {
    await expect(
      this.page.getByRole('heading', {
        name: /profile/i
      })
    ).toBeVisible();
  }
}