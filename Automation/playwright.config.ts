import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  testDir: './tests',

  timeout: 30 * 1000,

  expect: {
    timeout: 5000
  },

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'frontend',

      testMatch: [
        'tests/ui/**/*.spec.ts',
        'tests/e2e/**/*.spec.ts'
      ],

      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000'
      }
    },

    {
      name: 'api',

      testMatch: 'tests/api/**/*.spec.ts',

      use: {
        baseURL: 'http://localhost:5001/api'
      }
    }
  ],

  webServer: [
    {
      command: 'npm start',
      cwd: path.resolve(__dirname, '../Frontend'),
      url: 'http://localhost:3000',
      reuseExistingServer: true,
      timeout: 120 * 1000
    },

    {
      command: 'npm run dev',
      cwd: path.resolve(__dirname, '../Backend'),
      url: 'http://localhost:5001',
      reuseExistingServer: true,
      timeout: 120 * 1000
    }
  ]
});