import { test, expect } from '../../fixtures/apiFixtures.js';
import { ApiClient } from '../../utils/apiClient.js';
import {
  uniqueEmail,
  testPassword
} from '../../utils/testData.js';

test.describe('Authentication API', () => {

  test('should register a new user', async ({
    apiRequest
  }) => {

    const api = new ApiClient(apiRequest);

    const email = uniqueEmail();

    const response = await api.registerUser({
      name: 'Playwright User',
      email,
      password: testPassword
    });

    expect(response.status()).toBe(201);

    const body = await response.json();

    expect(body.message).toBe('Registered');
    expect(body.user).toBeDefined();
    expect(body.user.email).toBe(email);
    expect(body.user.name).toBe('Playwright User');
  });


  test('should login with valid credentials', async ({
    apiRequest
  }) => {

    const api = new ApiClient(apiRequest);

    const email = uniqueEmail();

    const registerResponse =
      await api.registerUser({
        name: 'Login Test User',
        email,
        password: testPassword
      });

    expect(registerResponse.status()).toBe(201);

    const loginResponse =
      await api.loginUser({
        email,
        password: testPassword
      });

    expect(loginResponse.status()).toBe(200);

    const body =
      await loginResponse.json();

    expect(body.message).toBe('Login successful');
    expect(body.user.email).toBe(email);
  });


  test('should reject invalid credentials', async ({
    apiRequest
  }) => {

    const api = new ApiClient(apiRequest);

    const email = uniqueEmail();

    await api.registerUser({
      name: 'Invalid Login User',
      email,
      password: testPassword
    });

    const response =
      await api.loginUser({
        email,
        password: 'WrongPassword'
      });

    expect(response.status()).toBe(400);

    const body =
      await response.json();

    expect(body.message).toBe('Invalid credentials');
  });

});