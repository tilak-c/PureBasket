import { APIRequestContext } from '@playwright/test';

export async function deleteProduct(
  request: APIRequestContext,
  productId: string
): Promise<void> {
  const response = await request.delete(
    `/products/${productId}`
  );

  if (!response.ok()) {
    console.warn(
      `Failed to delete product ${productId}. Status: ${response.status()}`
    );
  }
}