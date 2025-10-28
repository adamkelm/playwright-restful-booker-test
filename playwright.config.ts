import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * Playwright Configuration for Restful Booker API Test Suite
 *
 * This configuration is optimized for API testing with:
 * - Parallel test execution for faster runs
 * - Comprehensive reporting
 * - Retry logic for flaky tests
 * - Environment-specific settings
 *
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only - API tests may have intermittent network issues */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI to reduce load on the public API */
  workers: process.env.CI ? 1 : 4,

  /* Timeout for each test */
  timeout: 30000, // 30 seconds per test

  /* Global timeout */
  globalTimeout: 600000, // 10 minutes for entire test suite

  /* Reporter configuration */
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["json", { outputFile: "test-results/results.json" }],
    ["list"],
  ],

  /* Shared settings for all projects */
  use: {
    /* Base URL for the Restful Booker API */
    baseURL: "https://restful-booker.herokuapp.com",

    /* Collect trace when retrying failed tests */
    trace: "on-first-retry",

    /* Extra HTTP headers */
    extraHTTPHeaders: {
      Accept: "application/json",
    },

    /* Timeout for API requests */
    actionTimeout: 10000, // 10 seconds for individual API calls
  },

  /* Projects for different test categories */
  projects: [
    {
      name: "api-tests",
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
