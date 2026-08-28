import {
  test as base,
  expect,
  APIRequestContext
} from '@playwright/test';

type ApiFixtures = {
  apiRequest: APIRequestContext;
};

export const test = base.extend<ApiFixtures>({
  apiRequest: async ({ playwright }, use) => {
    const apiRequest =
      await playwright.request.newContext({
        baseURL: 'http://localhost:5001/api/'
      });

    console.log(
      'API FIXTURE BASE URL: http://localhost:5001/api/'
    );

    await use(apiRequest);

    await apiRequest.dispose();
  }
});

export { expect };