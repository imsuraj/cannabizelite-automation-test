/// <reference types="cypress" />
/// <reference path="./cypressTypes.ts" />
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Cypress.Commands.add("getIframe", (iframe) => {
//   cy.get(iframe)
//     .its("0.contentDocument.body")
//     .should("be.visible")
//     .then(cy.wrap);
// });

Cypress.Commands.add("getIframe", (iframe) => {
  cy.get(iframe)
    .find("iframe")
    .its("0.contentDocument.body")
    .should("be.visible")
    .then(cy.wrap);
});

// commands.js

Cypress.Commands.add("clickOkButton", (subject) => {
  subject.find("button[data-qa^=ok-button-visible]").click({ force: true });
});

Cypress.Commands.add("getIframeBody", () => {
  return cy
    .get(".tf-v1-widget")
    .find("iframe")
    .its("0.contentDocument.body")
    .should("not.be.empty")
    .then(cy.wrap);
});

Cypress.Commands.add("getCalendlyIframeBody", () => {
  return cy
    .getIframeBody()
    .find("iframe[title=Calendly]")
    .its("0.contentDocument.body")
    .should("not.be.empty")
    .then(cy.wrap)
    .find("iframe[src^='https://calendly.com']")
    .its("0.contentDocument.body")
    .should("not.be.empty")
    .then(cy.wrap);
});

Cypress.Commands.add("getQuestionBody", (questionNumber) => {
  return cy
    .getIframeBody()
    .find("[data-qa=question-wrapper]")
    .contains(`Question ${questionNumber}`)
    .parents("[data-qa=question-wrapper]")
    .first();
});

Cypress.Commands.add("getCalendlyIframeBodyCannabiz", () => {
  return cy
    .get("iframe.cal-embed", { timeout: 20000 })
    .its("0.contentDocument.body", { timeout: 20000 })
    .should("not.be.empty")
    .then(cy.wrap);
});

Cypress.Commands.add("getPaymentIframeBody", () => {
  return cy
    .get("iframe[name^='vault-master']")
    .its("0.contentDocument.body")
    .should("not.be.empty")
    .then(cy.wrap);
});

Cypress.Commands.add(
  "enterPaymentDetails",
  (firstName: string, lastName: string) => {
    cy.origin(
      "https://test-gateway.tillpayments.com",
      {
        args: [firstName, lastName],
      }, // Pass variables using the args option
      ([firstName, lastName]: [string, string]) => {
        cy.enterPaymentDetails(
          firstName,
          lastName,
          "41111111111", // Assume these are the card number, expiration month and year, and CVV
          "05",
          "2025",
          "123"
        );
      }
    );
  }
);

const origLog = Cypress.log;
Cypress.log = function (opts, ...other) {
  if (opts.displayName === "script" || opts.name === "request") {
    return;
  }
  return origLog(opts, ...other);
};

// add a custom Cypress command  "login" that automates the login process.
Cypress.Commands.add("login", (email, password) => {
  // use the cy.session command to create a session cache for the provided email and password.
  // this helps in reusing the login session across multiple test specifications, enhancing test performance.
  cy.session(
    // session identifier - email and password are used as keys to cache the session.
    [email, password],
    // callback function that contains the steps to perform the login.
    () => {
      // step 1: navigate to the login page.
      cy.visit("/login");

      // step 2: enter the user's email address into the email input field.
      cy.get("input[placeholder='Enter your Email Address']").type(email);

      // step 3: enter the user's password into the password input field.
      cy.get("input[type='password']").type(password);

      // step 4: click the "Get Started" button to submit the login form.
      // the { force: true } option ensures the button is clicked even if it might not be fully visible or clickable.
      cy.get("#get-started-btn").click({ force: true });

      // step 5: wait for 2 seconds to allow time for navigation and login processing.
      cy.wait(2000);

      // step 6: verify that the URL contains "/dashboard", indicating successful login.
      cy.url().should("include", "/dashboard");
    },
    {
      // enable session caching across different specs to avoid repeated logins,
      // thereby improving the overall test execution speed.
      cacheAcrossSpecs: true,
    }
  );
});

/**
 * custom command to click and select nurse or doctor
 */
Cypress.Commands.add("clickAndSelectDropDownValueForNurseOrDoctor", (value) => {
  cy.log(`Clicking dropdown to select value: ${value}`);
  cy.get(".select__control")
    .should("exist")
    .should("be.visible")
    .click({ force: true });

  cy.log("Waiting for dropdown menu to be visible");
  cy.get(".select__menu")
    .should("exist")
    .should("be.visible")
    .within(() => {
      cy.log(`Selecting value: ${value}`);
      cy.get(".select__menu-list")
        .should("exist")
        .should("be.visible")
        .contains("div", value)
        .click({ force: true });
    });
});

/**
 * custom command to enter value in a text field or text area
 */
Cypress.Commands.add(
  "enterValueInTextField",
  (locator: string, value: string, labelName: string) => {
    cy.log(`Entering value: ${value} in ${labelName}`);
    cy.get(locator).type(value, { force: true }).should("have.value", value);
  }
);
