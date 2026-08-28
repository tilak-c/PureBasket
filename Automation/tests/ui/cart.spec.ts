import {
  test,
  expect
} from '../../fixtures/testFixtures.js';

import {
  ProductsPage
} from '../../pages/ProductsPage.js';

import {
  CartPage
} from '../../pages/CartPage.js';

test.describe('Cart UI', () => {

  test('should add product and display cart', async ({
    authenticatedPage
  }) => {

    const products =
      new ProductsPage(
        authenticatedPage
      );

    await products.goto();

    await products.addFirstProduct();

    const cart =
      new CartPage(
        authenticatedPage
      );

    await cart.goto();

    await cart.expectCartItemVisible();
  });


  test('should increase product quantity', async ({
    authenticatedPage
  }) => {

    const products =
      new ProductsPage(
        authenticatedPage
      );

    await products.goto();

    await products.addFirstProduct();

    const cart =
      new CartPage(
        authenticatedPage
      );

    await cart.goto();

    await cart.increaseFirstItem();

    await expect(
      cart.quantityDisplays.first()
    ).toHaveText('2');
  });


  test('should remove product', async ({
    authenticatedPage
  }) => {

    const products =
      new ProductsPage(
        authenticatedPage
      );

    await products.goto();

    await products.addFirstProduct();

    const cart =
      new CartPage(
        authenticatedPage
      );

    await cart.goto();

    await cart.removeFirstItem();

    await expect(
      authenticatedPage.getByText(
        'Your cart is empty'
      )
    ).toBeVisible();
  });

});