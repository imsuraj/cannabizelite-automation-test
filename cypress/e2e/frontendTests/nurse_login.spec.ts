import { messages } from "cypress/support/messages";
import { onLoginPage } from "cypress/support/pageObjects/loginPage.po";
import { nurseEmail, nursePassword } from "cypress/support/utils";

// test comment
describe("Nurse login test", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("should be able to login with valid credentials", () => {
    onLoginPage.enterEmail(nurseEmail);
    onLoginPage.enterPassword(nursePassword);
    onLoginPage.isLoginButtonEnabled();
    onLoginPage.clickOnLoginButton();
    cy.url().should("include", "/dashboard");
  });

  it("should not enable login button without email", () => {
    onLoginPage.enterPassword(nursePassword);
    onLoginPage.isLoginButtonDisabled();
    cy.url().should("not.include", "/dashboard");
  });

  it("should not enable login button without password", () => {
    onLoginPage.enterEmail(nurseEmail);
    onLoginPage.isLoginButtonDisabled();
    cy.url().should("not.include", "/dashboard");
  });

  it("should display an error message for an invalid email", () => {
    onLoginPage.enterEmail("Invalid@email.com");
    onLoginPage.enterPassword(nursePassword);
    onLoginPage.isLoginButtonEnabled();
    onLoginPage.clickOnLoginButton();
    onLoginPage.getErrorMessageText().should("equal", messages.login.error);
    cy.url().should("not.include", "/dashboard");
  });

  it("should display an error message for an invalid password", () => {
    onLoginPage.enterEmail(nurseEmail);
    onLoginPage.enterPassword("invalidPassword");
    onLoginPage.isLoginButtonEnabled();
    onLoginPage.clickOnLoginButton();
    onLoginPage.getErrorMessageText().should("equal", messages.login.error);
    cy.url().should("not.include", "/dashboard");
  });
});
