import {
  Page,
  Locator,
  expect
} from '@playwright/test';

export class CartPage {
  private readonly page: Page;

  readonly cartItems: Locator;
  readonly quantityDisplays: Locator;
  readonly plusButtons: Locator;
  readonly minusButtons: Locator;
  readonly removeButtons: Locator;
  readonly clearButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cartItems =
      this.page.locator('.cart-item');

    this.quantityDisplays =
      this.page.locator('.qty-display');

    this.plusButtons =
      this.page
        .locator('.qty-btn')
        .filter({ hasText: '+' });

    this.minusButtons =
      this.page
        .locator('.qty-btn')
        .filter({ hasText: '-' });

    this.removeButtons =
      this.page.getByRole('button', {
        name: 'Remove'
      });

    this.clearButton =
      this.page.getByRole('button', {
        name: /clear cart/i
      });

    this.checkoutButton =
      this.page.getByRole('button', {
        name: /checkout/i
      });
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart');
  }

  async expectCartItemVisible(): Promise<void> {
    await expect(
      this.cartItems.first()
    ).toBeVisible();
  }

  async increaseFirstItem(): Promise<void> {
    await this.plusButtons.first().click();
  }

  async decreaseFirstItem(): Promise<void> {
    await this.minusButtons.first().click();
  }

  async removeFirstItem(): Promise<void> {
  await this.removeButtons.first().click();

  await this.page
    .getByRole('button', { name: 'Remove' })
    .last()
    .click();

  await expect(
    this.cartItems
  ).toHaveCount(0);
}

  async clearCart(): Promise<void> {
    await this.clearButton.click();

    await this.page
      .getByRole('button', {
        name: 'Remove'
      })
      .last()
      .click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();

    await this.page
      .getByRole('button', {
        name: 'Place Order'
      })
      .click();
  }
}