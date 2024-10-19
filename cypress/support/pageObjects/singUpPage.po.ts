import { onNurseDashboardPage } from "./nurseDashboard.po";

export class SignUpPage {
  // Element selectors
  screeningHeaderEle = ".let-us-know";
  radioInputType = 'input[type="radio"]';
  questionEle = '[role="group"]';
  basicInfoHeaderEle = "h3.auth-modal__title.sign-up__title.text-bold";
  termsConditionCheckboxEle = "#checker";
  continueBtnEle = "button#get-started-btn";

  firstNameEle = 'input[name="first_name"]';
  lastNameEle = 'input[name="last_name"]';
  phoneNumEle = 'input[name="phone_number"]';
  dobEle = "#dob";
  genderEle = 'input[type="radio"][value="';

  emailEle = 'input[name="email"]';
  passwordEle = 'input[name="password"]';
  confirmPasswordEle = 'input[name="confirm_password"]';

  calendyDateEle = 'button[data-testid="day"][data-disabled="false"]';
  viewNextMonthButtonEle = 'button[data-testid="view_next_month"]';
  calendyTimeEle = 'button[data-testid="time"][data-disabled="false"]';
  confirmButtonEle = 'button[data-testid="confirm-book-button"]';
  rescheduleButtonEle = 'button[data-testid="confirm-reschedule-button"]';

  successMessageEle = "p.auth__content__text";
  returnToDashEle = ".link_back";

  loginEle = {
    locator: "a",
    text: "Login",
  };

  // Method to check if the continue button is enabled
  checkButtonIsEnabled(): void {
    cy.get(this.continueBtnEle).should("not.have.attr", "disabled");
  }

  // Method to check if the continue button is disabled
  checkButtonIsDisabled(): void {
    cy.get(this.continueBtnEle).should("have.attr", "disabled");
  }

  // Method to select an answer option by index
  selectAnswer(index: number, option: string): void {
    cy.get(this.questionEle)
      .eq(index)
      .contains("div", option)
      .click({ force: true });
  }

  // method to select an answer based on question
  selectAnswerBasedOnQuestion(questionText: string, answer: string) {
    cy.contains('div[class="reasoning-for-seeking"]', questionText)
      .parent('div[class="input"]')
      .find(`${this.radioInputType}[value='${answer.toLowerCase()}']`)
      .click({ force: true });
  }

  // Method to get the text of the screening header
  getScreeningHeaderText(): Cypress.Chainable<string> {
    return this.getHeaderText(this.screeningHeaderEle);
  }

  // Helper method to get the text of any header element
  getHeaderText(headerEle: string): Cypress.Chainable<string> {
    return cy
      .get(headerEle)
      .invoke("text")
      .then((text) => text.trim());
  }

  // Method to click the terms and conditions checkbox
  agreeTerms(): void {
    cy.get(this.termsConditionCheckboxEle).click({ force: true });
  }

  // Method to get the text of the basic account info header
  getBasicAccountInfoHeaderText(): Cypress.Chainable<string> {
    return this.getHeaderText(this.basicInfoHeaderEle);
  }

  // Method to enter basic information for a new account
  enterBasicInformationForNewAccount(
    firstName: string,
    lastName: string,
    phoneNumber: string,
    email: string,
    dob: string,
    gender: string,
    password: string
  ): void {
    this.enterFirstName(firstName);
    this.enterLastName(lastName);
    this.enterPhoneNumber(phoneNumber);
    this.enterDateOfBirth(dob);
    this.selectGender(gender);
    this.enterEmail(email);
    this.enterBothPassword(password);
  }

  // Method to click the continue button
  clickOnButton(): void {
    cy.get(this.continueBtnEle).click({ force: true });
  }

  // Method to assign a nurse
  assignNurse(nurse: string): void {
    cy.clickAndSelectDropDownValueForNurseOrDoctor(nurse);
  }

  // Method to click the Next button
  clickOnNextButton(): void {
    // cy.get(".btn").click({ force: true });
    cy.wait(2000);
    cy.contains("Next").click({ force: true });
  }

  // Method to select a random available date in the calendar
  selectRandomDate(): void {
    cy.getCalendlyIframeBodyCannabiz()
      .find(this.calendyDateEle, {
        timeout: 15000, // Increased timeout to allow for iframe load
        retries: 3,
      })
      .then((elements) => {
        cy.log(`Found ${elements.length} active dates`);

        if (elements.length > 0) {
          const randomIndex = Math.floor(Math.random() * elements.length);
          cy.log(`Selecting active date having index ${randomIndex}`);
          cy.wrap(elements[randomIndex]).click({ force: true });
        } else {
          cy.get('button[data-testid="view_next_month"]').click({
            force: true,
          });
          this.selectRandomDate();
        }
      });
  }

  // Method to select a time slot
  selectTime(): void {
    cy.getCalendlyIframeBodyCannabiz()
      .find(this.calendyTimeEle, {
        timeout: 6000,
        retries: 3,
      })
      .first()
      .click({ force: true });
  }

  // Method to click the confirm button
  clickOnConfirmButton(): void {
    cy.getCalendlyIframeBodyCannabiz()
      .find(this.confirmButtonEle)
      .click({ force: true });
  }

  // Method to click the reschedule button
  clickOnRescheduleButton(): void {
    cy.getCalendlyIframeBodyCannabiz()
      .find(this.rescheduleButtonEle)
      .click({ force: true });
  }
  // Method to return success message
  getSuccessMessageText(): Cypress.Chainable<string> {
    return cy
      .get(this.successMessageEle)
      .invoke("text")
      .then((text) => text.trim());
  }

  //method to click on return to dashboard button
  clickOnReturnToDashboard(): void {
    cy.get(this.returnToDashEle).click({ force: true });
  }

  // method to enter first name
  enterFirstName(firstName: any) {
    cy.get(this.firstNameEle).type(firstName);
  }

  // method to enter last name
  enterLastName(lastName: any) {
    cy.get(this.lastNameEle).type(lastName);
  }

  // method to enter phone Number
  enterPhoneNumber(phoneNumber: any) {
    cy.get(this.phoneNumEle).type(phoneNumber);
  }

  // method to enter date of birth
  enterDateOfBirth(dob: any) {
    cy.get(this.dobEle).type(dob);
  }

  // method to select gender
  selectGender(gender: any) {
    cy.get(`${this.genderEle}${gender}"]`).click({ force: true });
  }

  //method to enter email
  enterEmail(email: any) {
    cy.log(`Email: ${email}`);
    cy.get(this.emailEle).type(email);
  }

  enterBothPassword(password: any) {
    cy.get(this.passwordEle).type(password);
    cy.get(this.confirmPasswordEle).type(password);
  }

  // Method to enter payment details
  enterPaymentDetails(
    firstName: string,
    lastName: string,
    cardNum: string,
    month: string,
    year: string,
    cvv: string
  ): void {
    cy.get("#first_name").type(firstName);
    cy.get("#last_name").type(lastName);
    cy.get("#creditcard_number > iframe").then(($iframe) => {
      const body = $iframe.contents().find("body");
      cy.wrap(body).find("input").type(cardNum);
    });
    cy.get("#month").type(month);
    cy.get("#year").type(year);
    cy.get("#cvv > iframe").then(($iframe) => {
      const body = $iframe.contents().find("body");
      cy.wrap(body).find("input").type(cvv);
    });
  }

  // Method to register
  registerPatient(
    firstName: string,
    lastName: string,
    phoneNumber: string,
    email: string,
    dob: string,
    gender: string,
    password: string,
    nurse: string
  ): void {
    //select answers
    this.selectAnswer(0, "Yes");
    this.selectAnswer(1, "Yes");
    this.selectAnswer(2, "Yes");
    this.selectAnswer(3, "Yes");
    this.selectAnswer(4, "No");
    this.selectAnswer(5, "No");
    this.agreeTerms();
    //click on continue button
    this.clickOnButton();
    this.enterFirstName(firstName);
    this.enterLastName(lastName);
    this.enterPhoneNumber(phoneNumber);
    this.enterDateOfBirth(dob);
    this.selectGender(gender);
    this.enterEmail(email);
    this.enterBothPassword(password);

    //click on Submit button
    this.clickOnButton();
    this.assignNurse(nurse);
    this.clickOnNextButton();
    // cy.wait(5000);
    this.selectRandomDate();
    // cy.wait(3000);
    this.selectTime();
    this.clickOnConfirmButton();
    cy.url({ timeout: 20000 }).should("include", "/booking-success");

    this.getSuccessMessageText().then((text) => {
      const expectedText = "Your booking has been completed successfully";
      expect(text).to.equal(expectedText);
    });

    this.clickOnReturnToDashboard();
    cy.wait(2000);
    onNurseDashboardPage.isLogoutDisplayed();
  }

  //Method to click on login link
  clickOnLoginLink() {
    cy.contains(this.loginEle.locator, this.loginEle.text)
      .should("be.visible")
      .click({ force: true });
  }
}

export const onSignUpPage = new SignUpPage();
