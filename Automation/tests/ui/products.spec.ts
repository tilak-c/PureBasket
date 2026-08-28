import { test, expect } from '@playwright/test';
import {
  uniqueEmail,
  testPassword
} from '../../utils/testData.js';
import { CartPage } from '../../pages/CartPage.js';

import { ProductsPage } from '../../pages/ProductsPage.js';

test.describe('Products UI', () => {

  test('should display products', async ({
    page
  }) => {

    const productsPage =
      new ProductsPage(page);

    await productsPage.goto();

    await productsPage.expectProductsVisible();
  });

test('should add product to cart', async ({
  page
}) => {

  const email = uniqueEmail();

  const registerResponse =
    await page.request.post(
      'http://localhost:5001/api/auth/register',
      {
        data: {
          name: 'Cart User',
          email,
          password: testPassword
        }
      }
    );

  expect(registerResponse.status()).toBe(201);

  await page.goto('/login');

  await page
    .locator('input[type="email"]')
    .fill(email);

  await page
    .locator('input[type="password"]')
    .fill(testPassword);

  await page
    .getByRole('button', {
      name: /login/i
    })
    .click();

  await expect(page).toHaveURL(/\/$/);

  await page.goto('/items');

  const productsPage =
    new ProductsPage(page);

  await productsPage.addFirstProduct();

  // Go directly to the cart
  const cart =
    new CartPage(page);

  await cart.goto();

  await cart.expectCartItemVisible();
});
});