export class LoginPage {
  emailEle = "input[placeholder='Enter your Email Address']";
  passwordEle = "input[type='password']";
  loginButtonEle = "#get-started-btn";
  forgetPasswordEle = {
    locator: ".text-muted",
    labelText: "Forgot Password?",
  };

  emailErrorEle = "";
  passwordErrorEle = "";
  errorMessageEle = "[role='status']";

  checkEmailErrorMessage(message) {
    cy.get(this.emailErrorEle)
      .should("be.visible")
      .and("contain.text", message);
  }

  checkPasswordErrorMessage(message) {
    cy.get(this.passwordErrorEle)
      .should("be.visible")
      .and("contain.text", message);
  }

  checkErrorMessage(message) {
    cy.get(this.errorMessageEle)
      .should("be.visible")
      .and("contain.text", message);
  }

  isEmailDisplayed() {
    cy.get(this.emailEle).should("be.visible");
  }

  enterEmail(username) {
    cy.get(this.emailEle).type(username);
  }

  isPasswordDisplayed() {
    cy.get(this.passwordEle).should("be.visible");
  }

  enterPassword(password) {
    cy.get(this.passwordEle).type(password);
  }

  isSignInButtonDisplayed() {
    cy.get(this.loginButtonEle).should("be.visible");
  }

  isLoginButtonDisabled() {
    cy.get(this.loginButtonEle).should("be.disabled");
  }
  isLoginButtonEnabled() {
    cy.get(this.loginButtonEle).should("be.enabled");
  }

  clickOnLoginButton() {
    cy.get(this.loginButtonEle).click({ force: true });
  }

  isForgetPasswordDisplayed() {
    cy.contains(this.forgetPasswordEle.locator).should("be.visible");
  }

  getErrorMessageText() {
    return cy.get(this.errorMessageEle).invoke("text");
  }

  login(email, password) {
    cy.log(`Login with email: ${email} and password:${password} `);
    this.enterEmail(email);
    this.enterPassword(password);
    this.isLoginButtonEnabled();
    this.clickOnLoginButton();
  }

  logout() {
    cy.get("logoutBtn").click({ force: true });
  }

  clickOnForgetPassword() {
    cy.contains(
      this.forgetPasswordEle.locator,
      this.forgetPasswordEle.labelText
    ).click({ force: true });
  }
}

export const onLoginPage = new LoginPage();
