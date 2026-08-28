import {
  test,
  expect
} from '../../fixtures/apiFixtures.js';

import {
  uniqueEmail,
  testPassword,
  uniqueProductName
} from '../../utils/testData.js';

test.describe('Order Status API', () => {

  let userId: string;
  let orderId: string;
  let productId: string;

  test.beforeEach(async ({ apiRequest }) => {

    // Create user
    const email = uniqueEmail();

    const registerResponse = await apiRequest.post(
      'auth/register',
      {
        data: {
          name: 'Order Status User',
          email,
          password: testPassword
        }
      }
    );
    console.log('REGISTER URL:', registerResponse.url());
console.log('REGISTER STATUS:', registerResponse.status());
console.log('REGISTER BODY:', await registerResponse.text());

    expect(registerResponse.status()).toBe(201);

    const userBody =
      await registerResponse.json();

    userId = userBody.user.id;


    // Create product
    const productResponse =
      await apiRequest.post(
        'products',
        {
          data: {
            name: uniqueProductName(),
            price: 500,
            imageUrl:
              'https://example.com/product.jpg'
          }
        }
      );

    expect(productResponse.status()).toBe(201);

    const productBody =
      await productResponse.json();

    productId = productBody._id;


    // Add product to cart
    const cartResponse =
      await apiRequest.post(
        `cart/${userId}/add`,
        {
          data: {
            productId,
            quantity: 1
          }
        }
      );

    expect(cartResponse.status()).toBe(200);


    // Create order
    const orderResponse =
      await apiRequest.post(
        `orders/${userId}/create-from-cart`
      );

    expect(orderResponse.status()).toBe(201);

    const orderBody =
      await orderResponse.json();

    console.log(
      'ORDER CREATION RESPONSE:',
      orderBody
    );

    orderId = orderBody._id;

    console.log(
      'ORDER ID:',
      orderId
    );
  });


  test(
    'should update order status to paid',
    async ({ apiRequest }) => {

      const response =
        await apiRequest.put(
          `orders/${orderId}/status`,
          {
            data: {
              status: 'paid'
            }
          }
        );

      expect(response.status()).toBe(200);

      const body =
        await response.json();

      expect(body.status).toBe('paid');
    }
  );


  test(
    'should update order status to shipped',
    async ({ apiRequest }) => {

      const response =
        await apiRequest.put(
          `orders/${orderId}/status`,
          {
            data: {
              status: 'shipped'
            }
          }
        );

      expect(response.status()).toBe(200);

      const body =
        await response.json();

      expect(body.status).toBe('shipped');
    }
  );


  test(
    'should update order status to delivered',
    async ({ apiRequest }) => {

      const response =
        await apiRequest.put(
          `orders/${orderId}/status`,
          {
            data: {
              status: 'delivered'
            }
          }
        );

      expect(response.status()).toBe(200);

      const body =
        await response.json();

      expect(body.status).toBe('delivered');
    }
  );


  test(
    'should update order status to cancelled',
    async ({ apiRequest }) => {

      const response =
        await apiRequest.put(
          `orders/${orderId}/status`,
          {
            data: {
              status: 'cancelled'
            }
          }
        );

      expect(response.status()).toBe(200);

      const body =
        await response.json();

      expect(body.status).toBe('cancelled');
    }
  );


  test(
    'should reject invalid order status',
    async ({ apiRequest }) => {

      const response =
        await apiRequest.put(
          `orders/${orderId}/status`,
          {
            data: {
              status: 'invalid-status'
            }
          }
        );

      expect(response.status()).toBe(400);

      const body =
        await response.json();

      expect(body.message).toBe(
        'Invalid status'
      );
    }
  );

});