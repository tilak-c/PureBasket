import { test, expect } from '../../fixtures/apiFixtures.js';
import { ApiClient } from '../../utils/apiClient.js';
import {
  uniqueProductName,
  testProduct
} from '../../utils/testData.js';

test.describe('Products API', () => {

  test('should create a product', async ({
    apiRequest
  }) => {

    const api = new ApiClient(apiRequest);

    const name = uniqueProductName();

    const response = await api.createProduct({
      name,
      price: testProduct.price,
      imageUrl: testProduct.imageUrl
    });

    expect(response.status()).toBe(201);

    const product = await response.json();

    expect(product._id).toBeDefined();
    expect(product.name).toBe(name);
    expect(product.price).toBe(testProduct.price);

    // Cleanup
    await api.deleteProduct(product._id);
  });


  test('should get all products', async ({
    apiRequest
  }) => {

    const api = new ApiClient(apiRequest);

    const response = await api.getProducts();

    expect(response.status()).toBe(200);

    const products = await response.json();

    expect(Array.isArray(products)).toBeTruthy();
    expect(products.length).toBeGreaterThan(0);
  });


  test('should get product by ID', async ({
    apiRequest
  }) => {

    const api = new ApiClient(apiRequest);

    const createResponse =
      await api.createProduct({
        name: uniqueProductName(),
        price: 299,
        imageUrl: testProduct.imageUrl
      });

    expect(createResponse.status()).toBe(201);

    const product =
      await createResponse.json();

    const response =
      await api.getProductById(product._id);

    expect(response.status()).toBe(200);

    const body =
      await response.json();

    expect(body._id).toBe(product._id);

    await api.deleteProduct(product._id);
  });


  test('should update a product', async ({
    apiRequest
  }) => {

    const api = new ApiClient(apiRequest);

    const createResponse =
      await api.createProduct({
        name: uniqueProductName(),
        price: 100,
        imageUrl: testProduct.imageUrl
      });

    expect(createResponse.status()).toBe(201);

    const product =
      await createResponse.json();

    const response =
      await api.updateProduct(product._id, {
        name: 'Updated Product',
        price: 500
      });

    expect(response.status()).toBe(200);

    const body =
      await response.json();

    expect(body.name).toBe('Updated Product');
    expect(body.price).toBe(500);

    await api.deleteProduct(product._id);
  });


  test('should delete a product', async ({
    apiRequest
  }) => {

    const api = new ApiClient(apiRequest);

    const createResponse =
      await api.createProduct({
        name: uniqueProductName(),
        price: 100,
        imageUrl: testProduct.imageUrl
      });

    expect(createResponse.status()).toBe(201);

    const product =
      await createResponse.json();

    const response =
      await api.deleteProduct(product._id);

    expect(response.status()).toBe(200);

    const body =
      await response.json();

    expect(body.message).toBe('Product deleted');
  });


  test('should reject product with missing fields', async ({
    apiRequest
  }) => {

    const api = new ApiClient(apiRequest);

    const response =
      await apiRequest.post(
        'http://localhost:5001/api/products',
        {
          data: {
            name: 'Invalid Product'
          }
        }
      );

    expect(response.status()).toBe(400);

    const body =
      await response.json();

    expect(body.message).toContain(
      'Name,price and imageUrl'
    );
  });


  test('should return 404 for a non-existent product', async ({
    apiRequest
  }) => {

    const api = new ApiClient(apiRequest);

    const fakeId =
      '507f1f77bcf86cd799439011';

    const response =
      await api.getProductById(fakeId);

    expect(response.status()).toBe(404);

    const body =
      await response.json();

    expect(body.message).toBe('Product not found');
  });

});