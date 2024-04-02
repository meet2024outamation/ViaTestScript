// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  // workers:3, used to execute test files parellelly , but tests within same file will still execute sequantialy default value=> max 5
  // retries:1, used to retry the tests which are failed. tests which were failed one first and passed in retries are called flaky tests.
  // /* Run tests in files in parallel */
  // fullyParallel: true,
  // /* Fail the build on CI if you accidentally left test.only in the source code. */
  // forbidOnly: !!process.env.CI,
  // /* Retry on CI only */
  // retries: process.env.CI ? 2 : 0,
  // /* Opt out of parallel tests on CI. */
  // workers: process.env.CI ? 1 : undefined,
  // /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // timeout: 60*1000,
  // expect:{
  //   timeout:5000
  // },
  expect: {
    timeout: 30000,
  },
  timeout: 100 * 1000,
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    browserName:"chromium",
    headless:false,
    trace:'on',
    viewport:{ width: 1600, height: 1200 },
    // ignoreHTTPSErrors: true, automatically go to advance and accept the ssl certification error
    // permissions: ["geolocation"], at any point if browser asks for location access then it will click allow .
    screenshot:'on',

launchOptions: {
  args: ["--start-maximized"],
}

  },

 
});

