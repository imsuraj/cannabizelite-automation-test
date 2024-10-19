import { faker } from "@faker-js/faker";
import { messages } from "cypress/support/messages";
import { onLoginPage } from "cypress/support/pageObjects/loginPage.po";
import {
  onAssignDoctor,
  onConsultationPage,
  onMedicalDetails,
  onNotesPage,
  onPersonalDetails,
} from "cypress/support/pageObjects/nurseConsultation.po";
import { onNurseDashboardPage } from "cypress/support/pageObjects/nurseDashboard.po";
import { onPatientDashboard } from "cypress/support/pageObjects/patientDashboard.po";
import { onPaymentPage } from "cypress/support/pageObjects/payment.po";
import { onSignUpPage } from "cypress/support/pageObjects/singUpPage.po";

import {
  applicationStatus,
  cardDetail,
  doctorName,
  expectedUrl,
  getRandomCharCode,
  getRandomDateString,
  getRandomGender,
  nurseEmail,
  nurseName,
  nursePassword,
  patientEmail,
  patientPassword,
} from "cypress/support/utils";

describe("Nurse Consultation tests", () => {
  // initialize basic details
  const personalDetails = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phoneNumber: faker.phone.number("+614########"),
    dateOfBirth: getRandomDateString(),
    gender: getRandomGender(),
    email: patientEmail,
    password: patientPassword,
    nurse: nurseName,
  };

  // initialize medical details
  const medicalDetails = {
    healthIdentifier: faker.string.numeric(16),
    medicareNumber: faker.string.numeric(10),
    medicareRefNumber: faker.string.numeric(1),
    medicareExpDate: "012030",
    previousGP: faker.string.numeric(3),
    concessionPensionNumber: faker.string.numeric(5),
    dvaNum: `QSS${faker.string.numeric({ length: 5 }).toUpperCase()}`,
    dvaCardColor: "G",
    mailAdd: String.fromCharCode(getRandomCharCode()),
  };

  // initialize notes
  const note = {
    title: faker.lorem.word(),
    body: faker.lorem.paragraph(),
  };

  // initialize medical detail text area label and its value
  const medicalDetailsTextAreas = [
    {
      label: "Reasoning for seeking medical cannabis ?",
      value: faker.lorem.sentence(),
    },
    {
      label: "Current Treatment tried",
      value: faker.lorem.sentence(),
    },
    {
      label: "Current Medications",
      value: faker.lorem.sentence(),
    },
    {
      label: "Any past or current major medical conditions ?",
      value: faker.lorem.sentence(),
    },
    {
      label:
        "Have you ever had any need for your liver function to be tested ?",
      value: faker.lorem.sentence(),
    },
    {
      label: "Blood test required ?",
      value: faker.lorem.sentence(),
    },
    {
      label: "Any major surgery in the past ?",
      value: faker.lorem.sentence(),
    },
    {
      label: "Any major injuries in the past ?",
      value: faker.lorem.sentence(),
    },
    {
      label: "Any allergies or reactions ?",
      value: faker.lorem.sentence(),
    },
    {
      label: "Any personal history of drug dependency ?",
      value: faker.lorem.sentence(),
    },
    {
      label: "Any hypersensitivity to cannabinoids ?",
      value: faker.lorem.sentence(),
    },
    {
      label:
        "Do you have history of psychosis, schizophrenia or family history of psychosis and/or schizophrenia?",
      value: faker.lorem.sentence(),
    },
    {
      label:
        "Do you smoke/vape nicotine ? If yes, how many cigarettes (or cigarettes equivalent) do you have per day ?",
      value: faker.lorem.sentence(),
    },
    {
      label: "If yes, previous clinic or prescriber's name?",
      value: faker.lorem.sentence(),
    },
    {
      label: "Please let us know how you came across HanaMed?",
      value: faker.lorem.sentence(),
    },
    {
      label: "Height ?",
      value: `${faker.number.int({ min: 4, max: 7 }).toString()}'${faker.number
        .int({ min: 0, max: 11 })
        .toString()}"`,
    },
    {
      label: "Weight ?",
      value: faker.number.int({ min: 20, max: 100 }).toString() + " kg",
    },
  ];

  // initialize medical detail dropdown label and its option
  const medicalDetailsDropdownSelections = [
    {
      label:
        "Do you drink alcohol? If yes, how many standard drinks do you have per week ?",
      option: ">10 SD/week",
    },
    {
      label:
        "Which one of the following statements better describes your condition?",
      option:
        "I have self-medicated in the past using cannabis for a medical condition.",
    },
  ];

  before(() => {
    // Load fixture data once and store it in aliases
    cy.fixture("screeningQnA").as("screeningQnA");
    cy.fixture("medicalDetailsQnA").as("medicalDetailsQnA");

    // Navigate to the URL
    cy.visit("/");
  });

  describe("Consultation test", () => {
    beforeEach(
      "register patient, book consultation with nurse and fill medical and personal details",
      () => {
        // Select the answers of screening questions
        cy.get("@screeningQnA").then((questionsData: any) => {
          questionsData.screeningQuestions.forEach((questionsData: any) => {
            cy.log(
              `Selecting "${questionsData.answer}" for question: "${questionsData.question}"`
            );
            onSignUpPage.selectAnswerBasedOnQuestion(
              questionsData.question,
              questionsData.answer
            );
          });
        });

        // click on agree terms and conditions
        onSignUpPage.agreeTerms();

        //click on continue button
        onSignUpPage.clickOnButton();

        // enter basic info of patient
        onSignUpPage.enterBasicInformationForNewAccount(
          personalDetails.firstName,
          personalDetails.lastName,
          personalDetails.phoneNumber,
          personalDetails.email,
          personalDetails.dateOfBirth,
          personalDetails.gender.toLowerCase(),
          personalDetails.password
        );

        //click on Submit button
        onSignUpPage.clickOnButton();
        onSignUpPage.assignNurse(personalDetails.nurse);
        onSignUpPage.clickOnNextButton();

        // cy.wait(5000);
        // select date on calendar
        onSignUpPage.selectRandomDate();

        // cy.wait(3000);
        // select time on calendar
        onSignUpPage.selectTime();

        //click on confirm button
        onSignUpPage.clickOnConfirmButton();

        //validate booking success url and message
        cy.url({ timeout: 20000 }).should(
          "include",
          expectedUrl.bookingSuccess
        );
        onSignUpPage.getSuccessMessageText().then((text) => {
          expect(text).to.equal(messages.booking.success);
        });

        // click on return dashboard and validate logout is displayed
        onSignUpPage.clickOnReturnToDashboard();
        cy.wait(2000);
        onNurseDashboardPage.isLogoutDisplayed();

        // click on logout button and validate login url is displayed
        onNurseDashboardPage.clickOnLogoutButton();
        onNurseDashboardPage.confirmLogout();
        cy.url({ timeout: 20000 }).should("include", expectedUrl.login);

        //login as nurse
        onLoginPage.enterEmail(nurseEmail);
        onLoginPage.enterPassword(nursePassword);
        onLoginPage.isLoginButtonEnabled();
        onLoginPage.clickOnLoginButton();
        cy.url().should("include", expectedUrl.dashboard);

        // review the application by patient email
        onNurseDashboardPage.clickOnReviewApplicationByEmail(
          personalDetails.email
        );
        cy.wait(2000);

        // Expected Personal details
        const personalDetailsBeforeEdit = [
          { label: "Patient Type", value: "Regular" },
          {
            label: "Patient Name",
            value: `${personalDetails.firstName} ${personalDetails.lastName}`,
          },
          { label: "Phone Number", value: personalDetails.phoneNumber },
          { label: "Medicare No", value: "NA" },
          { label: "IHI Number", value: "NA" },
          { label: "Medicare Reference No", value: "NA" },
          { label: "Medicare Expiry Date", value: "NA" },
          { label: "Previous GP", value: "NA" },
          { label: "Date of Birth", value: personalDetails.dateOfBirth },
          { label: "Gender", value: personalDetails.gender },
          { label: "Email", value: personalDetails.email },
          { label: "Address", value: "N/A" },
        ];

        // Validate personal details are as per the data entered by user
        personalDetailsBeforeEdit.forEach((detail) => {
          onConsultationPage.validatePersonalDetails(
            detail.label,
            detail.value
          );
        });

        // Validate screening questions and answers are correctly displayed before updating medical details
        cy.get("@screeningQnA").then((questionsData: any) => {
          questionsData.screeningQuestions.forEach((questionsData: any) => {
            cy.log(
              `Validating "${questionsData.answer}" for question: "${questionsData.question}"`
            );
            onConsultationPage.validateMedicalDetails(
              questionsData.question,
              questionsData.answer
            );
          });
        });

        // open personal details
        onConsultationPage.openPersonalDetailsModal();

        // add personal details
        onPersonalDetails.enterPersonalDetails(
          medicalDetails.healthIdentifier,
          medicalDetails.medicareNumber,
          medicalDetails.medicareRefNumber,
          medicalDetails.medicareExpDate,
          medicalDetails.previousGP,
          medicalDetails.concessionPensionNumber,
          medicalDetails.dvaNum,
          medicalDetails.dvaCardColor
        );
        // enter address
        onPersonalDetails
          .enterAddress(medicalDetails.mailAdd)
          .then((selectedAddress) => {
            cy.wrap(selectedAddress).as("selectedAddress");
          });

        cy.get("@selectedAddress").then((selectedAddress) => {
          cy.log(`Selected Address in first test: ${selectedAddress}`);
          const personalDetailsAfterEdit = [
            { label: "Patient Type", value: "Regular" },
            {
              label: "Patient Name",
              value: `${personalDetails.firstName} ${personalDetails.lastName}`,
            },
            { label: "Phone Number", value: personalDetails.phoneNumber },
            { label: "Medicare No", value: medicalDetails.medicareNumber },
            { label: "IHI Number", value: medicalDetails.healthIdentifier },
            {
              label: "Medicare Reference No",
              value: medicalDetails.medicareRefNumber,
            },
            {
              label: "Medicare Expiry Date",
              value: medicalDetails.medicareExpDate,
            },
            { label: "Previous GP", value: medicalDetails.previousGP },
            { label: "Date of Birth", value: personalDetails.dateOfBirth },
            { label: "Gender", value: personalDetails.gender },
            { label: "Email", value: personalDetails.email },
            { label: "Address", value: selectedAddress },
          ];

          onPersonalDetails.toggleSwitch();
          //Click on save changes
          onConsultationPage.clickSaveChanges();

          //validate success message
          onConsultationPage.validateSuccessMessage(
            messages.nurseConsultation.personalDetailsUpdateSuccess
          );
          cy.wait(2000);

          // validate personal details value in the consultation page.
          personalDetailsAfterEdit.forEach((detail) => {
            onConsultationPage.validatePersonalDetails(
              detail.label,
              detail.value
            );
          });
        });

        cy.wait(2000);

        // open the medical details modal
        onConsultationPage.openMedicalDetailsModal();

        // select values for medical details radio buttons
        cy.get("@medicalDetailsQnA").then((questionsData: any) => {
          questionsData.medicalQuestions.forEach((questionsData: any) => {
            cy.log(
              `Selecting "${questionsData.answer}" for question: "${questionsData.question}"`
            );
            onMedicalDetails.selectRadioButton(
              questionsData.question,
              questionsData.answer
            );
          });
        });

        // enter values for medical details text areas
        medicalDetailsTextAreas.forEach(({ label, value }) => {
          onMedicalDetails.fillTextArea(label, value);
        });

        // select values for medical details dropdowns
        medicalDetailsDropdownSelections.forEach(({ label, option }) => {
          onMedicalDetails.selectDropdownOption(label, option);
        });

        // save changes and validate success message for medical details
        onConsultationPage.clickSaveChanges();
        onConsultationPage.validateSuccessMessage(
          messages.nurseConsultation.medicalDetailsUpdateSuccess
        );

        cy.reload();

        //validating screening qna details after updating medical details
        cy.get("@screeningQnA").then((questionsData: any) => {
          questionsData.screeningQuestions.forEach((questionsData: any) => {
            cy.log(
              `Validating "${questionsData.answer}" for question: "${questionsData.question}"`
            );
            onConsultationPage.validateMedicalDetails(
              questionsData.question,
              questionsData.answer
            );
          });
        });

        //validating medical  qna details after updating medical details
        cy.get("@medicalDetailsQnA").then((questionsData: any) => {
          questionsData.medicalQuestions.forEach((questionsData: any) => {
            cy.log(
              `Validating "${questionsData.answer}" for question: "${questionsData.question}"`
            );
            onConsultationPage.validateMedicalDetails(
              questionsData.question,
              questionsData.answer
            );
          });
        });

        //validating medical dropdown qna details after updating medical details
        medicalDetailsDropdownSelections.forEach((detail) => {
          onConsultationPage.validateMedicalDetails(
            detail.label,
            detail.option
          );
        });

        //validating medical text box details after updating medical details
        medicalDetailsTextAreas.forEach((detail) => {
          onConsultationPage.validateMedicalDetails(detail.label, detail.value);
        });

        // add notes
        onNotesPage.clickAddNotesButton();
        onNotesPage.verifyModalTitle();

        onNotesPage.fillNotes(note.title, note.body);
        onConsultationPage.clickSaveChanges();
        onConsultationPage.validateSuccessMessage(
          messages.nurseConsultation.noteCreateSuccess
        );

        cy.reload();
        onConsultationPage.validateNoteDetails(note.title, note.body);

        // approve application and validate status
        onConsultationPage.clickOnApproveApplicationButton();
        onConsultationPage.validateSuccessMessage(
          messages.nurseConsultation.consultationApprovedSuccess
        );
        onConsultationPage.validateApplicationStatus(
          applicationStatus.nurseApproved
        );
        cy.wait(5000);
      }
    );

    it.skip("should display a success message after nurse completes payment and assign doctor for a patient after updating personal and medical details", () => {
      // validate payment option is displayed
      onConsultationPage.validateMakePaymentIsDisplayed();
      // click on make payment
      onConsultationPage.clickOnMakePayment();
      cy.wait(3000);

      //click on proceed
      onConsultationPage.clickOnProceedButton();
      cy.wait(3000);

      // enter payment details and confirm the payment
      onPaymentPage.fillPaymentForm(
        personalDetails.firstName,
        personalDetails.lastName,
        cardDetail.cardNo,
        cardDetail.month,
        cardDetail.year,
        cardDetail.cvv
      );
      // validate the url includes dashboard
      cy.url({ timeout: 30000 }).should(
        "include",
        expectedUrl.paymentSuccessUrl
      );
      // validate the payment success message is displayed
      onNurseDashboardPage.validateSuccessMessage(
        messages.dashboard.paymentSuccess
      );

      // review the application by patient email
      onNurseDashboardPage.clickOnReviewApplicationByEmail(
        personalDetails.email
      );

      // click on assign doctor
      onConsultationPage.clickOnAssignDoctor();

      cy.wait(1000);

      // select and assign a doctor
      onAssignDoctor.assignDoctor(doctorName);

      // click on next button
      onAssignDoctor.clickOnNextButton();

      // cy.wait(5000);
      // select date on calendar
      onSignUpPage.selectRandomDate();
      // cy.wait(3000);
      // select first available time
      onSignUpPage.selectTime();
      //click on confirm on cal.com screen
      onSignUpPage.clickOnConfirmButton();
      //validate the success message
      onAssignDoctor.getSuccessMessageText().then((text) => {
        expect(text).to.equal(
          messages.nurseConsultation.assignDoctorSuccessMessage
        );
      });
      //click on close icon
      onAssignDoctor.clickOnCloseIcon();
      cy.wait(500);
      //validate the application status is updated
      onConsultationPage.validateApplicationStatus(
        applicationStatus.prescriberConsultationPending
      );
    });

    it("should display payment skipped message when a nurse skips payment of a patient", () => {
      // validate payment option is displayed
      onConsultationPage.validateMakePaymentIsDisplayed();
      // click on make payment
      onConsultationPage.clickOnMakePayment();
      cy.wait(3000);

      // skip payment
      onConsultationPage.clickOnSkipButton();

      cy.wait(1000);
      // validate the skip payment message is displayed
      onNurseDashboardPage.validateSuccessMessage(
        messages.dashboard.paymentSkip
      );
    });

    it("should skip payment by nurse, complete payment by patient, then assign doctor", () => {
      // skip payment
      onConsultationPage.clickOnSkipButton();

      cy.wait(2000);
      // // validate the skip payment message is displayed
      // onNurseDashboardPage.validateSuccessMessage(messages.dashboard.paymentSkip);

      // click on logout button and validate login url is displayed
      onNurseDashboardPage.clickOnLogoutButton();
      onNurseDashboardPage.confirmLogout();
      cy.url({ timeout: 20000 }).should("include", expectedUrl.login);

      //login as Patient

      onLoginPage.login(personalDetails.email, personalDetails.password);
      onPatientDashboard.validateSuccessMessage(
        messages.dashboard.welcomePatient
      );

      onPatientDashboard.validateApplicationStatus("Nurse Approved");
      onPatientDashboard.validateMakePaymentIsDisplayed();
      onPatientDashboard.clickOnMakePayment();

      onPatientDashboard.clickOnProceedButton();
      cy.wait(3000);

      // enter payment details and confirm the payment
      onPaymentPage.fillPaymentForm(
        personalDetails.firstName,
        personalDetails.lastName,
        cardDetail.cardNo,
        cardDetail.month,
        cardDetail.year,
        cardDetail.cvv
      );

      // validate the payment success message is displayed
      onPatientDashboard.validateSuccessMessage(
        messages.dashboard.paymentSuccess
      );

      cy.wait(2000);

      // click on assign doctor
      onPatientDashboard.clickOnAssignDoctor();

      cy.wait(1000);

      // select and assign a doctor
      onAssignDoctor.assignDoctor(doctorName);

      // click on next button
      onAssignDoctor.clickOnNextButton();

      // cy.wait(5000);
      // select date on calendar
      onSignUpPage.selectRandomDate();
      // cy.wait(3000);
      // select first available time
      onSignUpPage.selectTime();
      //click on confirm on cal.com screen
      onSignUpPage.clickOnConfirmButton();
      //validate the booking success url is displayed
      cy.url({ timeout: 20000 }).should("include", expectedUrl.bookingSuccess);

      //validate the success message
      onSignUpPage.getSuccessMessageText().then((text) => {
        expect(text).to.equal(messages.booking.success);
      });

      //click on return to dashboard
      onSignUpPage.clickOnReturnToDashboard();

      cy.wait(1000);
      //validate the application status is updated
      onPatientDashboard.validateApplicationStatus(
        applicationStatus.prescriberConsultationPending
      );
    });
  });

  describe.only("Missed consultation test", () => {
    it("should display success message when nurse marked patient as missed", () => {
      // Select the answers of screening questions
      cy.get("@screeningQnA").then((questionsData: any) => {
        questionsData.screeningQuestions.forEach((questionsData: any) => {
          cy.log(
            `Selecting "${questionsData.answer}" for question: "${questionsData.question}"`
          );
          onSignUpPage.selectAnswerBasedOnQuestion(
            questionsData.question,
            questionsData.answer
          );
        });
      });

      // click on agree terms and conditions
      onSignUpPage.agreeTerms();

      //click on continue button
      onSignUpPage.clickOnButton();

      // enter basic info of patient
      onSignUpPage.enterBasicInformationForNewAccount(
        personalDetails.firstName,
        personalDetails.lastName,
        personalDetails.phoneNumber,
        personalDetails.email,
        personalDetails.dateOfBirth,
        personalDetails.gender.toLowerCase(),
        personalDetails.password
      );

      //click on Submit button
      onSignUpPage.clickOnButton();
      onSignUpPage.assignNurse(personalDetails.nurse);
      onSignUpPage.clickOnNextButton();

      // cy.wait(5000);
      // select date on calendar
      onSignUpPage.selectRandomDate();

      // cy.wait(3000);
      // select time on calendar
      onSignUpPage.selectTime();

      //click on confirm button
      onSignUpPage.clickOnConfirmButton();

      //validate booking success url and message
      cy.url({ timeout: 20000 }).should("include", expectedUrl.bookingSuccess);
      onSignUpPage.getSuccessMessageText().then((text) => {
        expect(text).to.equal(messages.booking.success);
      });

      // click on return dashboard and validate logout is displayed
      onSignUpPage.clickOnReturnToDashboard();
      cy.wait(2000);
      onNurseDashboardPage.isLogoutDisplayed();

      // click on logout button and validate login url is displayed
      onNurseDashboardPage.clickOnLogoutButton();
      onNurseDashboardPage.confirmLogout();
      cy.url({ timeout: 20000 }).should("include", expectedUrl.login);

      //login as nurse
      onLoginPage.enterEmail(nurseEmail);
      onLoginPage.enterPassword(nursePassword);
      onLoginPage.isLoginButtonEnabled();
      onLoginPage.clickOnLoginButton();
      cy.url().should("include", expectedUrl.dashboard);

      // review the application by patient email
      onNurseDashboardPage.clickOnReviewApplicationByEmail(
        personalDetails.email
      );
      cy.wait(2000);

      // click on missed button
      onConsultationPage.clickOnMissedButton();

      cy.wait(2000);
      //validate success message
      onConsultationPage.validateSuccessMessage(
        messages.nurseConsultation.consultationMissed
      );
    });
  });
});
