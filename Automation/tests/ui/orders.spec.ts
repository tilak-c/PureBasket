import {
  test,
  expect
} from '../../fixtures/testFixtures.js';

import {
  OrdersPage
} from '../../pages/OrdersPage.js';

import {
  ProductsPage
} from '../../pages/ProductsPage.js';

test.describe('Orders UI', () => {

  test('should open orders page', async ({
    authenticatedPage
  }) => {

    const orders =
      new OrdersPage(
        authenticatedPage
      );

    await orders.goto();

    await expect(
      authenticatedPage
    ).toHaveURL(/\/orders/);
  });


  test('should show an order after checkout', async ({
    authenticatedPage
  }) => {

    // Add product
    const products =
      new ProductsPage(
        authenticatedPage
      );

    await products.goto();

    await products.addFirstProductAndWaitForResponse();

    // Open cart
    await authenticatedPage.goto('/cart');

    // Verify cart item exists
    await expect(
      authenticatedPage
        .locator('.cart-item')
        .first()
    ).toBeVisible();

    // Checkout
    await authenticatedPage
      .getByRole('button', {
        name: /checkout/i
      })
      .click();

    // Confirm order dialog
    await expect(
      authenticatedPage.getByText(
        'Place the order?'
      )
    ).toBeVisible();

    // Place order
    await authenticatedPage
      .getByRole('button', {
        name: 'Place Order'
      })
      .click();

    // Verify navigation to orders page
    await expect(
      authenticatedPage
    ).toHaveURL(/\/orders/);

    // Verify order appears in UI
    await expect(
      authenticatedPage
        .locator('.order-card')
        .first()
    ).toBeVisible();
  });

});