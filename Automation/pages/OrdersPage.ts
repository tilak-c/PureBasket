import {
  Page,
  Locator,
  expect
} from '@playwright/test';

export class OrdersPage {
  private readonly page: Page;

  readonly orderCards: Locator;

  constructor(page: Page) {
    this.page = page;

    this.orderCards =
      this.page.locator('.order-card');
  }

  async goto(): Promise<void> {
    await this.page.goto('/orders');
  }

  async expectOrdersVisible(): Promise<void> {
    await expect(
      this.orderCards.first()
    ).toBeVisible();
  }

  async expectNoOrders(): Promise<void> {
    await expect(
      this.page.getByText('No Orders Found')
    ).toBeVisible();
  }

  async openFirstOrder(): Promise<void> {
    await this.orderCards.first().click();
  }
}