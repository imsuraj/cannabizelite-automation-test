import { faker } from "@faker-js/faker";
import { messages } from "cypress/support/messages";
import { onLoginPage } from "cypress/support/pageObjects/loginPage.po";
import {
  onConsultationPage,
  onMedicalDetails,
  onNotesPage,
  onPersonalDetails,
} from "cypress/support/pageObjects/nurseConsultation.po";
import { onNurseDashboardPage } from "cypress/support/pageObjects/nurseDashboard.po";
import {
  onNewRxPage,
  onPrescriberConsultationPage,
  onRecipePage,
} from "cypress/support/pageObjects/prescriberConsultation.po";
import { onPrescriberDashboardPage } from "cypress/support/pageObjects/prescriberDashboard.po";
import { onSignUpPage } from "cypress/support/pageObjects/singUpPage.po";
import {
  expectedUrl,
  generateFormattedEndDate,
  generateFormattedStartDate,
  getRandomCharCode,
  getRandomDateString,
  getRandomGender,
  nurseName,
  patientEmail,
  patientPassword,
  prescriberEmail,
  prescriberPassword,
} from "cypress/support/utils";

describe("Prescriber consultation  test", () => {
  const startDate = generateFormattedStartDate();
  const endDate = generateFormattedEndDate(startDate);

  // initialize basic details object
  const personalDetails = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phoneNumber: faker.phone.number("+614########"),
    dateOfBirth: getRandomDateString(),
    gender: getRandomGender(),
    email: patientEmail,
    password: patientPassword,
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

  // initialize medical detail dropdown label and its option array
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

  // initialize new recipe
  const newRecipe = {
    recipeName: faker.lorem.word(),
    strength: `${faker.string.numeric(1)} mg`,
    quantity: faker.number.int({ min: 1, max: 9 }).toString(),
    units: faker.number.int({ min: 1, max: 9 }).toString(),
    form: "Capsules",
    repeats: faker.number.int({ min: 1, max: 9 }).toString(),
    route: "Intra-Ocular",
    restriction: "Pbs/Rpbs",
    batch: faker.string.numeric(4),
  };

  // initialize existing recipe data
  const recipeData = {
    product: "Paracetamel",
    productTitle: "Paracetamel 20 10",
    dose: "1",
    frequency: "In The Morning",
    foodInstruction: "On An Empty Stomach",
    generalInstruction: "As Directed",
  };

  before(() => {
    // Load fixture data once and store it in aliases
    cy.fixture("screeningQnA").as("screeningQnA");
    cy.fixture("medicalDetailsQnA").as("medicalDetailsQnA");
  });

  beforeEach(() => {
    cy.visit("/");
    onSignUpPage.clickOnLoginLink();
    cy.login(prescriberEmail, prescriberPassword);
    cy.visit("/");

    cy.url().should("include", expectedUrl.dashboard);
    onNurseDashboardPage.validateSuccessMessage(
      messages.dashboard.welcomePrescriber
    );

    // review the application by patient email
    onNurseDashboardPage.clickOnReviewApplicationByStatus("Under Review");
  });

  describe("Medication test", () => {
    it("should display a success message after creating a new recipe for medication", () => {
      // click on medications
      onPrescriberConsultationPage.ClickOnMedications();

      // click on New Rx
      onPrescriberConsultationPage.ClickOnNewRx();
      // validate new recipe is displayed
      onPrescriberConsultationPage.clickOnNewRecipe();

      onRecipePage.enterName(newRecipe.recipeName);
      onRecipePage.enterStrength(newRecipe.strength);
      onRecipePage.enterQuantity(newRecipe.quantity);
      onRecipePage.enterQuantityExtended(newRecipe.quantity);
      onRecipePage.enterUnits(newRecipe.units);
      onRecipePage.selectForm(newRecipe.form);
      onRecipePage.enterRepeats(newRecipe.repeats);
      onRecipePage.selectRoute(newRecipe.route);
      onRecipePage.selectRestriction(newRecipe.restriction);
      onRecipePage.enterBatch(newRecipe.batch);

      onRecipePage.searchIngredient(newRecipe.recipeName);
      onRecipePage.enterIngredientStrength(newRecipe.strength);
      onRecipePage.enterIngredientUnit(newRecipe.units);
      onRecipePage.clickAddButton();
      onRecipePage.verifyRecipeInTable(
        newRecipe.recipeName,
        newRecipe.strength,
        newRecipe.units
      );
      onRecipePage.clickSaveButton();

      // validate success message
      onConsultationPage.validateSuccessMessage(
        messages.newRx.productAddedSuccess
      );
    });
    it("should display a success message and list patient under prescribed patients  after creating a medication with existing recipe", () => {
      // onNewRxPage.validatePatientName(patientName);
      // onNewRxPage.validateDOB(patientDob);

      // click on medications
      onPrescriberConsultationPage.ClickOnMedications();

      // click on New Rx
      onPrescriberConsultationPage.ClickOnNewRx();
      // Select "Paracetamel" from the list of recipe
      onNewRxPage.selectProductFromList(recipeData.product);
      // Click on "Fstat 10mg 1"
      onNewRxPage.selectFirstOption(recipeData.productTitle);

      // Optionally, assert that the correct option was selected
      onNewRxPage.validateSelectedOption(recipeData.productTitle);

      // Click on "Next"
      onNewRxPage.clickNextButton();

      // Click on "Enter Dose"
      // Enter "1" into "Enter Dose"
      onNewRxPage.enterDose(recipeData.dose);

      // Click on "In The Morning"
      onNewRxPage.selectFrequency(recipeData.frequency);

      // Click on "On An Empty Stomach"
      onNewRxPage.selectFoodInstruction(recipeData.foodInstruction);

      // Click on "As Directed"
      onNewRxPage.selectGeneralInstruction(recipeData.generalInstruction);

      // Click on "23" in start date calendar
      onNewRxPage.enterStartDate(startDate);

      // Click on "23" in end date calendar
      onNewRxPage.enterEndDate(endDate);

      // Enter quantity
      onNewRxPage.enterQuantity(newRecipe.quantity);
      // Enter "4" into "Enter quantity extended i.e 20g"
      onNewRxPage.enterQuantityExtended(newRecipe.quantity);

      // Click on "Toggle Dropdown"
      onNewRxPage.clickPrescribe();

      // Click on "Paper Prescription"

      onNewRxPage.selectPaperPrescription();

      // validate success message
      onConsultationPage.validateSuccessMessage(
        messages.newRx.prescriptionSuccess
      );

      // click on close icon
      onPrescriberConsultationPage.clickCloseIcon();

      // validate application status
      // onConsultationPage.validateApplicationStatus(applicationStatus.prescribed);

      // navigate to the Prescribed Patients
      onPrescriberConsultationPage.navigateToPrescribedPatients();

      // validate the patient is displayed under Prescribed patients
      // onPrescriberDashboardPage.validatePatientIsDisplayed(existingPatientEmail);
    });

    it.skip("should not allow doctor to to prescribe a medication without selecting product (next button disabled case)", () => {
      // Please write test yourself. Everything was not possible during my tenure
    });

    it.skip("should display a validation message when doctor clicks on paper prescription without entering value for mandatory fields", () => {
      // Please write test yourself. Everything was not possible during my tenure});
    });
    it("should display a validation message when doctor selects start date later than the end date", () => {
      // onNewRxPage.validatePatientName(patientName);
      // onNewRxPage.validateDOB(patientDob);

      // Select "Paracetamel" from the list of recipe
      onNewRxPage.selectProductFromList(recipeData.product);
      // Click on "Fstat 10mg 1"
      onNewRxPage.selectFirstOption(recipeData.productTitle);

      // Optionally, assert that the correct option was selected
      onNewRxPage.validateSelectedOption(recipeData.productTitle);

      // Click on "Next"
      onNewRxPage.clickNextButton();

      // Click on "Enter Dose"
      // Enter "1" into "Enter Dose"
      onNewRxPage.enterDose(recipeData.dose);

      // Click on "In The Morning"
      onNewRxPage.selectFrequency(recipeData.frequency);

      // Click on "On An Empty Stomach"
      onNewRxPage.selectFoodInstruction(recipeData.foodInstruction);

      // Click on "As Directed"
      onNewRxPage.selectGeneralInstruction(recipeData.generalInstruction);

      // Click on "23" in start date calendar
      onNewRxPage.enterStartDate(endDate);

      // Click on "23" in end date calendar
      onNewRxPage.enterEndDate(startDate);

      // Enter quantity
      onNewRxPage.enterQuantity(newRecipe.quantity);
      // Enter "4" into "Enter quantity extended i.e 20g"
      onNewRxPage.enterQuantityExtended(newRecipe.quantity);

      // Click on "Toggle Dropdown"
      onNewRxPage.clickPrescribe();

      // Click on "Paper Prescription"

      onNewRxPage.selectPaperPrescription();
      cy.wait(2000);

      // validate success message is not displayed
      onConsultationPage.validateFailedMessage(
        messages.newRx.prescriptionFailed
      );
    });

    it.only("should validate success message when a prescriber edit medical detail, personal details and add notes", () => {
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

      onPersonalDetails.toggleSwitch();
      //Click on save changes
      onConsultationPage.clickSaveChanges();

      //validate success message
      onConsultationPage.validateSuccessMessage(
        messages.nurseConsultation.personalDetailsUpdateSuccess
      );
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

      // add notes
      onNotesPage.clickAddNotesButton();
      onNotesPage.verifyModalTitle();

      onNotesPage.fillNotes(note.title, note.body);
      onConsultationPage.clickSaveChanges();
      onConsultationPage.validateSuccessMessage(
        messages.nurseConsultation.noteCreateSuccess
      );
    });
  });
});
