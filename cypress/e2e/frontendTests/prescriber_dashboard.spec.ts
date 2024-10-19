import { onSignUpPage } from "cypress/support/pageObjects/singUpPage.po";
import {
  getCurrentFormattedDate,
  getTime,
  prescriberEmail,
  prescriberPassword,
} from "../../support/utils";

import { onNurseDashboardPage } from "cypress/support/pageObjects/nurseDashboard.po";

describe("Prescriber Dashboard Test", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("Prescriber Dashboard - Search and Apply filter tests", () => {
    //define test data for patient Id
    const patientIds = [
      "SC-P0235",
      "SC-P0236",
      "SC-P0237",
      "&*&*JKH",
      "$%SC-P0235**",
    ];
    const patientName = "Cannabiz Patient";
    const nurse = "SCSS Nurse";
    const applicationStatus = "Under Review";

    beforeEach(() => {
      // load fixture data and alias it
      cy.fixture("filterPatientTestData").as("patientData");

      // perform login steps before each test
      onSignUpPage.clickOnLoginLink();
      cy.login(prescriberEmail, prescriberPassword);
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

    it("should display list of patient whose nurse matches with selected nurse", () => {
      // click on filter icon and apply filter by assigned prescriber
      onNurseDashboardPage.clickOnFilterIcon(" Approved By (Nurse)");

      cy.wait(1000);
      // select prescriber
      onNurseDashboardPage.selectPrescriber(["SCSS Nurse"]);

      cy.debug();

      // click on apply filter button
      onNurseDashboardPage.clickOnApplyFilterButton();

      // validate that each row's prescriber column contains the selected prescriber
      onNurseDashboardPage.verifyPrescriberInTable(nurse);
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
      onNurseDashboardPage.verifyApplicationStatusInTable(applicationStatus);
    });
  });
});
