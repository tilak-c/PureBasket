import {
  Page,
  Locator,
  expect
} from '@playwright/test';

export class LoginPage {
  private readonly page: Page;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput =
      this.page.locator(
        'input[type="email"]'
      );

    this.passwordInput =
      this.page.locator(
        'input[type="password"]'
      );

    this.loginButton =
      this.page.getByRole('button', {
        name: /login/i
      });

    this.errorMessage =
      this.page.locator('.auth-error');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(
    email: string,
    password: string
  ): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoginPage(): Promise<void> {
    await expect(
      this.page.getByRole('heading', {
        name: 'Welcome Back'
      })
    ).toBeVisible();
  }

  async expectLoginError(
    message?: string
  ): Promise<void> {
    await expect(
      this.errorMessage
    ).toBeVisible();

    if (message) {
      await expect(
        this.errorMessage
      ).toContainText(message);
    }
  }
}