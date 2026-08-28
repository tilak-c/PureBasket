import { test, expect } from '../../fixtures/apiFixtures.js';
import { ApiClient } from '../../utils/apiClient.js';
import {
  uniqueEmail,
  testPassword
} from '../../utils/testData.js';

test.describe('Users API', () => {

  async function createUser(
    api: ApiClient
  ) {

    const email = uniqueEmail();

    const response =
      await api.registerUser({
        name: 'Test User',
        email,
        password: testPassword
      });

    expect(response.status()).toBe(201);

    const body =
      await response.json();

    return body.user;
  }


  test('should get user by ID', async ({
    apiRequest
  }) => {

    const api = new ApiClient(apiRequest);

    const user =
      await createUser(api);

    const response =
      await api.getUser(user.id);

    expect(response.status()).toBe(200);

    const body =
      await response.json();

    expect(body.user.id).toBe(user.id);
    expect(body.user.email).toBe(user.email);
  });


  test('should update user profile', async ({
    apiRequest
  }) => {

    const api = new ApiClient(apiRequest);

    const user =
      await createUser(api);

    const response =
      await api.updateUser(user.id, {
        name: 'Updated Name',
        phone: '9876543210'
      });

    expect(response.status()).toBe(200);

    const body =
      await response.json();

    expect(body.message).toBe('Profile updated');
    expect(body.user.name).toBe('Updated Name');
    expect(body.user.phone).toBe('9876543210');
  });


  test('should list users', async ({
    apiRequest
  }) => {

    const api = new ApiClient(apiRequest);

    const response =
      await api.listUsers();

    expect(response.status()).toBe(200);

    const body =
      await response.json();

    expect(Array.isArray(body.users))
      .toBeTruthy();
  });


  test('should reject invalid user ID', async ({
    apiRequest
  }) => {

    const api = new ApiClient(apiRequest);

    const response =
      await api.getUser('invalid-id');

    expect(response.status()).toBe(400);

    const body =
      await response.json();

    expect(body.message).toBe('Invalid id');
  });

});