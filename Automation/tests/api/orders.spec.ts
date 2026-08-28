import { test, expect } from '../../fixtures/apiFixtures.js';
import { ApiClient } from '../../utils/apiClient.js';
import {
  uniqueEmail,
  testPassword,
  uniqueProductName
} from '../../utils/testData.js';

test.describe('Orders API', () => {

  let api: ApiClient;
  let userId: string;
  let productId: string;

  test.beforeEach(async ({ apiRequest }) => {

    api = new ApiClient(apiRequest);

    // Create user
    const email = uniqueEmail();

    const registerResponse =
      await api.registerUser({
        name: 'Order Test User',
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
        price: 300,
        imageUrl: 'https://example.com/product.jpg'
      });

    expect(productResponse.status()).toBe(201);

    const productBody =
      await productResponse.json();

    productId = productBody._id;
  });


  test('should create order from cart', async () => {

    await api.addToCart(
      userId,
      productId,
      2
    );

    const response =
      await api.createOrderFromCart(userId);

    expect(response.status()).toBe(201);

    const order =
      await response.json();

    expect(order.user).toBe(userId);
    expect(order.items.length).toBe(1);
    expect(order.items[0].quantity).toBe(2);
    expect(order.totalPrice).toBe(600);
    expect(order.status).toBe('created');
  });


  test('should return user order history', async () => {

    await api.addToCart(
      userId,
      productId,
      1
    );

    await api.createOrderFromCart(userId);

    const response =
      await api.getOrders(userId);

    expect(response.status()).toBe(200);

    const orders =
      await response.json();

    expect(Array.isArray(orders))
      .toBeTruthy();

    expect(orders.length)
      .toBeGreaterThan(0);
  });


  test('should reject checkout when cart is empty', async () => {

    const response =
      await api.createOrderFromCart(userId);

    expect(response.status()).toBe(400);

    const body =
      await response.json();

    expect(body.message)
      .toContain('Cart is empty');
  });

});