import {
  test,
  expect
} from '../../fixtures/testFixtures.js';

test.describe('Checkout E2E', () => {

  test('user should complete a purchase and create an order', async ({
    authenticatedPage
  }) => {

    // Open products
    await authenticatedPage.goto('/items');

    await expect(
      authenticatedPage
        .locator('.product-card')
        .first()
    ).toBeVisible();

    // Add product
    await authenticatedPage
      .getByRole('button', {
        name: /add to cart/i
      })
      .first()
      .click();

    // Verify cart badge
    await expect(
      authenticatedPage
        .locator('.cart-badge')
    ).toHaveText('1');

    // Open cart
    await authenticatedPage.goto('/cart');

    // Verify cart item
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

    // Confirm order
    await expect(
      authenticatedPage.getByText(
        'Place the order?'
      )
    ).toBeVisible();

    await authenticatedPage
      .getByRole('button', {
        name: 'Place Order'
      })
      .click();

    // Verify navigation
    await expect(
      authenticatedPage
    ).toHaveURL(/\/orders/);

    // Verify order appears in UI
    await expect(
      authenticatedPage
        .locator('.order-card')
        .first()
    ).toBeVisible();

    // Verify order exists through API
    const userData =
      await authenticatedPage.evaluate(() => {
        const user =
          localStorage.getItem('user');

        return user
          ? JSON.parse(user)
          : null;
      });

    expect(userData).toBeTruthy();

    const response =
      await authenticatedPage.request.get(
        `http://localhost:5001/api/orders/user/${userData.id}`
      );

    expect(response.status()).toBe(200);

    const orders =
      await response.json();

    expect(
      Array.isArray(orders)
    ).toBeTruthy();

    expect(
      orders.length
    ).toBeGreaterThan(0);
  });

});