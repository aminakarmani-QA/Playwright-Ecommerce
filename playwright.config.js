// @ts-check
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 40000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  
  ],
  
  use: {
    baseURL: process.env.BASE_URL || 'https://automationexercise.com/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    viewport: { width: 1920, height: 1080 },
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: { 
          args: ['--start-maximized'] 
        },
      },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // Mobile viewports
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],
});