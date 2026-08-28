import { test, expect } from '../../fixtures/apiFixtures.js';
import { ApiClient } from '../../utils/apiClient.js';
import {
  uniqueEmail,
  testPassword,
  uniqueProductName
} from '../../utils/testData.js';

test.describe('Cart API', () => {

  let api: ApiClient;
  let userId: string;
  let productId: string;

  test.beforeEach(async ({ apiRequest }) => {

    api = new ApiClient(apiRequest);

    // Create user
    const email = uniqueEmail();

    const registerResponse =
      await api.registerUser({
        name: 'Cart Test User',
        email,
        password: testPassword
      });

    expect(registerResponse.status()).toBe(201);

    const userBody =
      await registerResponse.json();

    userId = userBody.user.id;


    // Create product
    const productResponse =
      await api.createProduct({
        name: uniqueProductName(),
        price: 250,
        imageUrl: 'https://example.com/product.jpg'
      });

    expect(productResponse.status()).toBe(201);

    const productBody =
      await productResponse.json();

    productId = productBody._id;
  });


  test('should create/get an empty cart', async () => {

    const response =
      await api.getCart(userId);

    expect(response.status()).toBe(200);

    const cart =
      await response.json();

    expect(cart.user).toBe(userId);
    expect(cart.items).toEqual([]);
  });


  test('should add product to cart', async () => {

    const response =
      await api.addToCart(
        userId,
        productId,
        1
      );

    expect(response.status()).toBe(200);

    const cart =
      await response.json();

    expect(cart.items.length).toBe(1);
    expect(cart.items[0].quantity).toBe(1);
    expect(cart.items[0].price).toBe(250);
  });


  test('should increase existing product quantity', async () => {

    await api.addToCart(
      userId,
      productId,
      1
    );

    const response =
      await api.addToCart(
        userId,
        productId,
        2
      );

    expect(response.status()).toBe(200);

    const cart =
      await response.json();

    expect(cart.items.length).toBe(1);
    expect(cart.items[0].quantity).toBe(3);
  });


  test('should calculate cart total', async () => {

    await api.addToCart(
      userId,
      productId,
      3
    );

    const response =
      await api.getCartTotal(userId);

    expect(response.status()).toBe(200);

    const body =
      await response.json();

    expect(body.total).toBe(750);
    expect(body.totalItems).toBe(3);
  });


  test('should clear cart', async () => {

    await api.addToCart(
      userId,
      productId,
      2
    );

    const response =
      await api.clearCart(userId);

    expect(response.status()).toBe(200);

    const body =
      await response.json();

    expect(body.cart.items).toEqual([]);
  });

});