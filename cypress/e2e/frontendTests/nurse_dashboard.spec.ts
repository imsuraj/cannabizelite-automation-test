import { onSignUpPage } from "cypress/support/pageObjects/singUpPage.po";
import {
  nurseEmail,
  emailDomain,
  getCurrentFormattedDate,
  getDateInfo,
  getRandomCharCode,
  getRandomDateString,
  getTime,
  nurseName,
  nursePassword,
} from "../../support/utils";
import { onLoginPage } from "cypress/support/pageObjects/loginPage.po";
import { onNurseDashboardPage } from "cypress/support/pageObjects/nurseDashboard.po";

describe("Nurse Dashboard Test", () => {
  const time = getTime();
  let patient: any;
  // const mailAdd = String.fromCharCode(getRandomCharCode());
  // const patientEmail = "suraj.anand+1716951426965@scssconsulting.com";

  beforeEach(() => {
    cy.visit("/");
  });

  describe("Nurse Dashboard - Search and Apply filter tests", () => {
    //define test data for patient Id
    const patientIds = [
      "SC-P0235",
      "SC-P0236",
      "SC-P0237",
      "&*&*JKH",
      "$%SC-P0235**",
    ];
    const patientName = "Cannabiz Patient";
    const prescriber = "Rick Cooper";
    const applicationStatus = "Nurse Consultation Pending";
    const expectedApplicationStatus = "Consultation Pending";

    beforeEach(() => {
      // load fixture data and alias it
      cy.fixture("filterPatientTestData").as("patientData");

      // perform login steps before each test
      onSignUpPage.clickOnLoginLink();
      cy.login(nurseEmail, nursePassword);
      cy.visit("/");
    });

    patientIds.forEach((patientId) => {
      it(`should display list of patient that match with the patient Id: ${patientId}`, () => {
        // click on filter icon and apply filter by patient ID
        onNurseDashboardPage.clickOnFilterIcon("Patient Id");

        // enter value into patientId text field
        onNurseDashboardPage.enterPatientId(patientId);

        // click on apply filter button
        onNurseDashboardPage.clickOnApplyFilterButton();

        // validate that each row's first td contains the searched patient ID
        onNurseDashboardPage.verifyPatientIdInTable(patientId);
      });
    });

    it("should display list of patients that match with the patient Ids @using fixtures", () => {
      // get patient data from fixture
      cy.get("@patientData").then((data: any) => {
        Cypress._.each(data.patientIds, (patientId) => {
          // click on filter icon and apply filter by patient ID
          onNurseDashboardPage.clickOnFilterIcon("Patient Id");

          // enter value into patientId text field
          onNurseDashboardPage.enterPatientId(patientId);

          // click on apply filter button
          onNurseDashboardPage.clickOnApplyFilterButton();

          // validate that each row's first td contains the searched patient ID
          onNurseDashboardPage.verifyPatientIdInTable(patientId);
        });
      });
    });

    it("should display list of patients that match with the patient names @using fixtures", () => {
      // get patient data from fixture
      cy.get("@patientData").then((data: any) => {
        Cypress._.each(data.patientNames, (patientName) => {
          cy.wrap(null).then(() => {
            // click on filter icon and apply filter by patient name
            onNurseDashboardPage.clickOnFilterIcon(" Patient Full Name");

            // enter value into patient name text field
            onNurseDashboardPage.enterPatientFullName(patientName);

            // click on apply filter button
            onNurseDashboardPage.clickOnApplyFilterButton();

            // validate that each row's second td contains the searched patient name
            onNurseDashboardPage.verifyPatientFullNameInTable(patientName);
          });
        });
      });
    });

    it("should display list of patient that match with the patient name", () => {
      // click on filter icon and apply filter by patient name
      onNurseDashboardPage.clickOnFilterIcon(" Patient Full Name");

      // enter value into patient name text field
      onNurseDashboardPage.enterPatientFullName(patientName);

      // click on apply filter button
      onNurseDashboardPage.clickOnApplyFilterButton();

      // validate that each row's second td contains the searched patient name
      onNurseDashboardPage.verifyPatientFullNameInTable(patientName);
    });

    it("should display list of patient whose prescriber matches with selected prescriber", () => {
      // click on filter icon and apply filter by assigned prescriber
      onNurseDashboardPage.clickOnFilterIcon("Assigned Prescriber");

      // select prescriber
      onNurseDashboardPage.selectPrescriber([prescriber]);

      // click on apply filter button
      onNurseDashboardPage.clickOnApplyFilterButton();

      // validate that each row's prescriber column contains the selected prescriber
      onNurseDashboardPage.verifyPrescriberInTable(prescriber);
    });

    it("should display list of patient whose consultation date matches with selected date and time", () => {
      //get and store current date in format dd MMM yyyy (01 January 2024)
      const formattedDate = getCurrentFormattedDate();

      // click on filter icon and apply filter by consultation date/time
      onNurseDashboardPage.clickOnFilterIcon("Consultation Date/Time");

      // select today date
      onNurseDashboardPage.clickOnTodaysConsult();
      cy.wait(3000);

      // validate that each row's consultation date column contains the searched date
      onNurseDashboardPage.verifyConsultationDateInTable(formattedDate);
    });

    it("should display list of patient whose application status matches with selected status", () => {
      // click on filter icon and apply filter by application status
      onNurseDashboardPage.clickOnFilterIcon(" Application Status");

      // select value for application status
      onNurseDashboardPage.selectApplicationStatus([applicationStatus]);

      // click on apply filter button
      onNurseDashboardPage.clickOnApplyFilterButton();

      // validate that each row's application status column contains the searched status
      onNurseDashboardPage.verifyApplicationStatusInTable(
        expectedApplicationStatus
      );
    });
  });

  it("Should navigate user to the patient summary page after clicking on Review Application button", () => {
    // Find the patient in the table and click the "Review Application" button
    cy.fixture("patientSignUpData").then((data) => {
      patient = {
        ...data,
        email: `${data.email}${time}${emailDomain}`,
        lastName: `${data.lastName}${time}`,
        dob: getRandomDateString(),
      };

      onSignUpPage.registerPatient(
        patient.firstName,
        patient.lastName,
        patient.phoneNumber,
        patient.email,
        patient.dob,
        patient.gender.toLowerCase(),
        patient.password,
        nurseName
      );

      onNurseDashboardPage.clickOnLogoutButton();
      onNurseDashboardPage.confirmLogout();
      cy.url({ timeout: 20000 }).should("include", "/login");
      onLoginPage.enterEmail(nurseEmail);
      onLoginPage.enterPassword(nursePassword);
      onLoginPage.isLoginButtonEnabled();
      onLoginPage.clickOnLoginButton();
      cy.url().should("include", "/dashboard");
      onNurseDashboardPage.clickOnReviewApplicationByEmail(patient.email);
    });
    cy.wait(2000);
    cy.url().should("include", "/nurse/consultation/");
    onNurseDashboardPage.checkPersonalDetailsIsDisplayed();
  });

  it.skip("Nurse should be able to mark patient as missed patient", () => {});
});
