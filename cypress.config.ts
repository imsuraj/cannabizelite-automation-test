import { defineConfig } from "cypress";
import { beforeRunHook } from "cypress-mochawesome-reporter/lib";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  viewportWidth: 1280,
  viewportHeight: 768,
  pageLoadTimeout: 60000,
  defaultCommandTimeout: 12000,

  video: false, // retries: { openMode: 1, runMode: 2 },

  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    charts: true,
    reportDir: "cypress/reports/html",
    reportFilename: "[status]_[datetime]-[name]-report",
    overwrite: false,
    html: true,
    json: true,
    reportPageTitle: "API Automation Test Report",
    reportTitle: "Automation Test Report",
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    code: true,
    autoOpen: false,
  },
  env: { ...process.env },
  e2e: {
    chromeWebSecurity: false,
    experimentalWebKitSupport: true,
    experimentalOriginDependencies: true,
    watchForFileChanges: false,
    setupNodeEvents(on, config) {
      // require("cypress-mochawesome-reporter/plugin")(on);
      on("before:run", async (details) => {
        await beforeRunHook(details);
      });
      const environmentName = config.env.environmentName || "dev";
      const environmentFilename = `./${environmentName}.settings.json`;
      console.log("loading %s", environmentFilename);
      const settings = require(environmentFilename);
      if (settings.baseUrl) {
        config.baseUrl = settings.baseUrl;
      }
      if (settings.env) {
        config.env = {
          ...config.env,
          ...settings.env,
        };
      }
      console.log("loaded settings for environment %s", environmentName);

      // IMPORTANT: return the updated config object
      // for Cypress to use it
      return config;
    },

    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
  },
});
