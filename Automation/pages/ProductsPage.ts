import {
  Page,
  Locator,
  expect
} from '@playwright/test';

export class ProductsPage {
  private readonly page: Page;

  readonly productCards: Locator;
  readonly addButtons: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.productCards =
      this.page.locator('.product-card');

    this.addButtons =
      this.page.getByRole('button', {
        name: /add to cart/i
      });

    this.cartLink =
      this.page.getByRole('link', {
        name: /cart/i
      });
  }

  async goto(): Promise<void> {
    await this.page.goto('/items');
  }

  async expectProductsVisible(): Promise<void> {
    await expect(
      this.productCards.first()
    ).toBeVisible();
  }

  async addFirstProduct(): Promise<void> {
  await this.addButtons.first().click();

  await this.page.waitForResponse(
    response =>
      response.url().includes('/api/cart/') &&
      response.request().method() === 'POST' &&
      response.status() === 200
  );
}
async addFirstProductAndWaitForResponse(): Promise<void> {
  await Promise.all([
    this.page.waitForResponse(
      response =>
        response.url().includes('/api/cart/') &&
        response.request().method() === 'POST' &&
        response.status() === 200
    ),
    this.addButtons.first().click()
  ]);
}

  async clickCart(): Promise<void> {
    await this.cartLink.click();
  }
}