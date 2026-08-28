import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from './apiConfig.js';

export class ApiClient {
  constructor(
    private request: APIRequestContext
  ) {}

  // =========================
  // AUTH
  // =========================

  async registerUser(data: {
    name: string;
    email: string;
    password: string;
  }) {
    return this.request.post(
      `${API_BASE_URL}/auth/register`,
      { data }
    );
  }

  async loginUser(data: {
    email: string;
    password: string;
  }) {
    return this.request.post(
      `${API_BASE_URL}/auth/login`,
      { data }
    );
  }

  // =========================
  // PRODUCTS
  // =========================

  async getProducts() {
    return this.request.get(
      `${API_BASE_URL}/products`
    );
  }

  async getProductById(productId: string) {
    return this.request.get(
      `${API_BASE_URL}/products/${productId}`
    );
  }

  async createProduct(data: {
    name: string;
    price: number;
    imageUrl: string;
  }) {
    return this.request.post(
      `${API_BASE_URL}/products`,
      { data }
    );
  }

  async updateProduct(
    productId: string,
    data: {
      name?: string;
      price?: number;
      imageUrl?: string;
    }
  ) {
    return this.request.put(
      `${API_BASE_URL}/products/${productId}`,
      { data }
    );
  }

  async deleteProduct(productId: string) {
    return this.request.delete(
      `${API_BASE_URL}/products/${productId}`
    );
  }

  // =========================
  // CART
  // =========================

  async getCart(userId: string) {
    return this.request.get(
      `${API_BASE_URL}/cart/${userId}`
    );
  }

  async addToCart(
    userId: string,
    productId: string,
    quantity = 1
  ) {
    return this.request.post(
      `${API_BASE_URL}/cart/${userId}/add`,
      {
        data: {
          productId,
          quantity
        }
      }
    );
  }

  async updateCartItem(
    userId: string,
    itemId: string,
    quantity: number
  ) {
    return this.request.put(
      `${API_BASE_URL}/cart/${userId}/update`,
      {
        data: {
          itemId,
          quantity
        }
      }
    );
  }

  async removeCartItem(
    userId: string,
    itemId: string
  ) {
    return this.request.delete(
      `${API_BASE_URL}/cart/${userId}/remove/${itemId}`
    );
  }

  async getCartTotal(userId: string) {
    return this.request.get(
      `${API_BASE_URL}/cart/${userId}/total`
    );
  }

  async clearCart(userId: string) {
    return this.request.delete(
      `${API_BASE_URL}/cart/${userId}/clear`
    );
  }

  // =========================
  // ORDERS
  // =========================

  async createOrderFromCart(userId: string) {
    return this.request.post(
      `${API_BASE_URL}/orders/${userId}/create-from-cart`
    );
  }

  async getOrders(userId: string) {
    return this.request.get(
      `${API_BASE_URL}/orders/user/${userId}`
    );
  }

  async getOrderById(orderId: string) {
    return this.request.get(
      `${API_BASE_URL}/orders/${orderId}`
    );
  }

  async updateOrderStatus(
    orderId: string,
    status: string
  ) {
    return this.request.put(
      `${API_BASE_URL}/orders/${orderId}/status`,
      {
        data: { status }
      }
    );
  }

  // =========================
  // USERS
  // =========================

  async getUser(userId: string) {
    return this.request.get(
      `${API_BASE_URL}/users/${userId}`
    );
  }

  async updateUser(
    userId: string,
    data: {
      name?: string;
      phone?: string;
      avatarUrl?: string;
    }
  ) {
    return this.request.put(
      `${API_BASE_URL}/users/${userId}`,
      { data }
    );
  }

  async listUsers() {
    return this.request.get(
      `${API_BASE_URL}/users`
    );
  }

  async deleteUser(userId: string) {
    return this.request.delete(
      `${API_BASE_URL}/users/${userId}`
    );
  }
}