export function uniqueEmail(): string {
  return `playwright_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 8)}@example.com`;
}

export const testPassword = 'Test@12345';

export function uniqueProductName(): string {
  return `Playwright Product ${Date.now()}`;
}

export const testProduct = {
  price: 199,
  imageUrl: 'https://example.com/product.jpg'
};