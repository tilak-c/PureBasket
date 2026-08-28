import {
  Page,
  Locator,
  expect
} from '@playwright/test';

export class RegisterPage {
  private readonly page: Page;

  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nameInput =
      this.page.locator(
        'input[placeholder="Full Name"]'
      );

    this.emailInput =
      this.page.locator(
        'input[type="email"]'
      );

    this.passwordInput =
      this.page.locator(
        'input[type="password"]'
      );

    this.registerButton =
      this.page.getByRole('button', {
        name: /register/i
      });
  }

  async goto(): Promise<void> {
    await this.page.goto('/register');
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    await this.registerButton.click();
  }

  async expectRegisterPage(): Promise<void> {
    await expect(
      this.page.getByRole('heading', {
        name: 'Create Account'
      })
    ).toBeVisible();
  }

  async expectRegistrationError(
    message?: string
  ): Promise<void> {
    const errorMessage =
      this.page.locator('.auth-error');

    await expect(
      errorMessage
    ).toBeVisible();

    if (message) {
      await expect(
        errorMessage
      ).toContainText(message);
    }
  }
}