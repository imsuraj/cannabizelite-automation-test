import { onSignUpPage } from "cypress/support/pageObjects/singUpPage.po";
import {
  getRandomDateString,
  getTime,
  nurseName,
  options,
  emailDomain,
} from "cypress/support/utils";
import { messages } from "cypress/support/messages";
import { onNurseDashboardPage } from "cypress/support/pageObjects/nurseDashboard.po";

describe("Cannabiz Patient SignUp Test", () => {
  const time = getTime();
  let patient: any;

  beforeEach("", () => {
    // Load patient data from fixture
    cy.fixture("patientSignUpData").then((data) => {
      patient = {
        ...data,
        email: `${data.email}${time}${emailDomain}`,
        lastName: `${data.lastName}${time}`,
        dob: getRandomDateString(),
      };
    });

    //Navigate to the URL
    cy.visit("/");
  });
  it.only("should register a patient when valid details are provided.", () => {
    //Check button is disabled.
    onSignUpPage.checkButtonIsDisabled();

    //validate header text
    onSignUpPage.getScreeningHeaderText().then((text) => {
      cy.log(text);
      const expectedText = "Let us get to know you better";
      expect(text.trim()).to.equal(expectedText);
    });

    //select answers
    const answers = [
      options.yes,
      options.yes,
      options.yes,
      options.yes,
      options.no,
      options.no,
    ];
    answers.forEach((answer, index) => {
      onSignUpPage.selectAnswer(index, answer);
    });

    //agree terms and conditions
    onSignUpPage.agreeTerms();

    //click on continue button
    onSignUpPage.clickOnButton();

    //enter basic info - first name, last name, phone number, email , dob, gender and password
    onSignUpPage.enterBasicInformationForNewAccount(
      patient.firstName,
      patient.lastName,
      patient.phoneNumber,
      patient.email,
      patient.dob,
      patient.gender.toLowerCase(),
      patient.password
    );

    //click on Submit button
    onSignUpPage.clickOnButton();

    //select nurse
    onSignUpPage.assignNurse(nurseName);

    //click on next
    onSignUpPage.clickOnNextButton();

    // cy.wait(5000);
    // select date on calendar
    onSignUpPage.selectRandomDate();
    // cy.wait(3000);
    // select first available time
    onSignUpPage.selectTime();

    //click on confirm on cal.com screen
    onSignUpPage.clickOnConfirmButton();

    //validate the booking success url is displayed
    cy.url({ timeout: 20000 }).should("include", "/booking-success");

    //validate the success message
    onSignUpPage.getSuccessMessageText().then((text) => {
      expect(text).to.equal(messages.booking.success);
    });

    //click on return to dashboard
    onSignUpPage.clickOnReturnToDashboard();

    //validate logout button is displayed.
    onNurseDashboardPage.isLogoutDisplayed();
  });
});
