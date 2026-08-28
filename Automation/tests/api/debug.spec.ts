import { test, expect } from '../../fixtures/apiFixtures.js';
import { ApiClient } from '../../utils/apiClient.js';

test('debug API client', async ({ apiRequest }) => {

  const api = new ApiClient(apiRequest);

  const response = await api.getProducts();

  console.log('STATUS:', response.status());
  console.log('URL:', response.url());

  expect(response.status()).toBe(200);

  const products = await response.json();

  expect(Array.isArray(products)).toBeTruthy();
  expect(products.length).toBeGreaterThan(0);
});