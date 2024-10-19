export class PrescriberConsultationPage {
  // Locators
  detailsCardTitle = ".main-detail .card-title";
  modalTrigger = 'img[data-bs-toggle="modal"][data-bs-target="#myModal"]';
  modal = "#myModal";
  personalDetailLabel = "Personal Details";
  medicalDetailLabel = "Medical Details";
  saveChangesEle = "form > button";
  successMessageEle = '[class^="go"][role="status"]';
  approveApplicationBtn = ".w-full > .primary-button";
  applicationStatusBadge =
    ".d-flex.flex-column.align-items-center .application_status_badge.badge";

  makePaymentBtn = {
    locator: ".row.w-full .detail-button",
    labelText: "Make Payment",
  };

  assignDoctorLabel = "Assign Doctor";

  medicationBtnELe = {
    locator: '[class="btn btn-outline-primary btn-sm"]',
    labelText: "Medication",
  };

  newRxBtnELe = {
    locator: ".d-none .btn",
    labelText: "New Rx",
  };

  newRecipeBtnEle = {
    locator: 'button[class="btn btn-primary"]',
    labelText: "New Recipe",
  };
  // Methods

  validatePersonalDetails(labelText, value) {
    // Find the card containing the label text, then find the corresponding value element and assert its text
    cy.contains(".card-key", labelText)
      .should("be.visible")
      .parent("div")
      .find(".card-value")
      .invoke("text")
      .then((text) => {
        // Convert both text and value to lower case and trim whitespace before asserting
        expect(text.trim().toLowerCase()).to.equal(value.toLowerCase());
      });
  }

  validateMedicalDetails(labelText, value) {
    // Find the card containing the label text, then find the corresponding value element and assert its text
    cy.contains(".card-question", labelText)
      .should("be.visible")
      .parent("div.medical-detail-card")
      .find(".card-answer")
      .invoke("text")
      .then((text) => {
        // Convert both text and value to lower case and trim whitespace before asserting
        expect(text.trim().toLowerCase()).to.equal(value.toLowerCase());
      });
  }

  validateNoteDetails(title, body) {
    cy.get(".note-body")
      .parent("div")
      .find('[class^="text-gray"]')
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).to.equal(title.toLowerCase());
      });
    cy.get(".note-body")
      .find("p")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim().toLowerCase()).to.equal(body.toLowerCase());
      });
  }

  /**
   * open details modal based on the card title
   * @param labelText - the label text of the card title
   */
  openDetailsModal(labelText: string) {
    cy.get(this.detailsCardTitle)
      .contains(labelText)
      .parent(".card-header")
      .find(this.modalTrigger)
      .click();
    cy.get(this.modal).should("be.visible");
  }

  /**
   * open the personal details modal
   */
  openPersonalDetailsModal() {
    this.openDetailsModal(this.personalDetailLabel);
  }

  /**
   * open the medical details modal
   */
  openMedicalDetailsModal() {
    this.openDetailsModal(this.medicalDetailLabel);
  }

  /**
   * click the save changes button
   */
  clickSaveChanges() {
    // cy.get(this.saveChangesEle).click({ force: true });
    cy.get(this.saveChangesEle)
      .scrollIntoView()
      .should("be.visible")
      .should("not.be.disabled")
      .click({ force: true });
  }

  /**
   * validate the success message after saving changes
   * @param expectedMessage - the expected success message
   */
  validateSuccessMessage(expectedMessage: string) {
    cy.contains(this.successMessageEle, expectedMessage);
  }

  /**
   * click on approve application button
   */
  clickOnApproveApplicationButton() {
    cy.get(this.approveApplicationBtn).click({ force: true });
  }

  /**
   * validate the application status
   * @param status - the expected status
   */
  validateApplicationStatus(status) {
    cy.get(this.applicationStatusBadge).should("have.text", status);
  }

  /**
   * validate make payment button is displayed
   */
  validateMakePaymentIsDisplayed() {
    cy.get(this.makePaymentBtn.locator).should("be.visible");
  }

  /**
   * click on Make Payment button
   */
  clickOnMakePayment() {
    cy.contains(this.makePaymentBtn.locator, this.makePaymentBtn.labelText)
      .scrollIntoView()
      .should("be.visible")
      .should("not.be.disabled")
      .click({ force: true });
  }

  /**
   * click on Proceed button
   */
  clickOnProceedButton() {
    cy.contains("button", "Proceed").should("be.visible").click();
  }

  /**
   * click on Assign button
   */
  clickOnAssignDoctor() {
    cy.contains(this.makePaymentBtn.locator, this.assignDoctorLabel)
      .scrollIntoView()
      .should("be.visible")
      .should("not.be.disabled")
      .click({ force: true });
  }

  /**
   * click on medication
   */
  ClickOnMedications() {
    cy.contains(this.medicationBtnELe.locator, this.medicationBtnELe.labelText)
      .should("be.visible")
      .click({ force: true })
      .wait(1000); // getprescriptions api seems to be called twice
  }

  /**
   * click on New Rx
   */
  ClickOnNewRx() {
    cy.contains(this.newRxBtnELe.locator, this.newRxBtnELe.labelText)
      .should("be.visible")
      .click({ force: true });
  }

  /**
   * click on new recipe
   */
  clickOnNewRecipe() {
    cy.contains(this.newRecipeBtnEle.locator, this.newRecipeBtnEle.labelText)
      .should("be.visible")
      .click({ force: true });
  }

  clickCloseIcon() {
    cy.log("Clicking the close icon");
    cy.get(
      ".d-none.d-md-flex.align-items-center.new-rx svg.cursor-pointer"
    ).click({ force: true });
  }
  navigateToPrescribedPatients() {
    cy.log('Navigating to "Prescribed Patients"');
    cy.get('a[href="/prescribed-patients"]').click({ force: true });
  }
}

export class RecipePage {
  enterName(name: string) {
    cy.enterValueInTextField("#name", name, "Name");
  }

  enterStrength(strength: string) {
    cy.enterValueInTextField("#strength", strength, "Strength");
  }

  enterQuantity(quantity: string) {
    cy.enterValueInTextField(
      "[placeholder='Enter Quantity']",
      quantity,
      "Quantity"
    );
  }

  enterQuantityExtended(quantity: string) {
    cy.enterValueInTextField(
      ":nth-child(4) > .wrapper_bar > .d-flex > .w-full",
      quantity,
      "Quantity Extended"
    );
  }

  enterUnits(units: string) {
    cy.enterValueInTextField("#units", units, "Units");
  }

  selectForm(option: string) {
    this.selectDropDownOption("Form", "Select Form", option);
  }

  enterRepeats(repeats: string) {
    cy.enterValueInTextField(
      `[placeholder="Enter Repeats"]`,
      repeats,
      "Enter Repeats"
    );
  }

  selectDropDownOption(labelName: string, placeholder: string, option: string) {
    cy.log(`Selecting value: ${option}`);
    cy.contains(".label_name", labelName)
      .parent()
      .find(".select__placeholder")
      .contains(placeholder)
      .click({ force: true });
    cy.get(".select__menu")
      .should("be.visible")
      .find(".select__menu-list")
      .should("be.visible")
      .contains("div", option)
      .click({ force: true });
  }

  selectRoute(option: string) {
    this.selectDropDownOption("Route", "Select Route", option);
  }

  selectRestriction(option: string) {
    this.selectDropDownOption("Restriction", "Select Restriction", option);
  }

  enterBatch(batch: string) {
    cy.enterValueInTextField("#batch", batch, "Batch");
  }

  searchIngredient(ingredient: string) {
    cy.log(`Searching for ingredient: ${ingredient}`);
    cy.contains(".label_name", "Ingredient")
      .parent()
      .find(".select__placeholder")
      .contains("Enter/Search")
      .click({ force: true });

    cy.enterValueInTextField(
      "#react-select-5-input",
      ingredient,
      "Ingredient"
    ).type("{enter}", { force: true });
  }

  enterIngredientStrength(strength: string) {
    cy.log(`Entering ingredient strength: ${strength}`);
    cy.get('[class="row align-items-end"]')
      .find("#strength")
      .type(strength, { force: true });
  }

  enterIngredientUnit(unit: string) {
    cy.log(`Entering ingredient unit: ${unit}`);
    cy.get('[class="row align-items-end"]')
      .find("#unit")
      .type(unit, { force: true });
  }

  clickAddButton() {
    cy.log('Clicking the "Add" button');
    cy.get('[class="row align-items-end"]')
      .find("button.btn")
      .should("contain", "Add")
      .should("be.enabled")
      .click({ force: true });
  }

  verifyRecipeInTable(ingredient: string, strength: string, unit: string) {
    cy.log("Verifying the new recipe in the table");
    cy.wait(1000);
    cy.get('[class="row align-items-end"]')
      .parent("div")
      .find("tbody tr")
      .first()
      .within(() => {
        cy.get("td").eq(0).should("contain", ingredient);
        cy.get("td").eq(1).should("contain", strength);
        cy.get("td").eq(2).should("contain", unit);
      });
  }

  clickSaveButton() {
    cy.log('Clicking the "Save" button');
    cy.contains("button.btn", "Save")
      .should("be.enabled")
      .click({ force: true });
  }
}

export class NewRxPage {
  validatePatientName(patientName) {
    cy.contains("div.card-key", "Patient Name")
      .parent("div")
      .find("div.card-item-value")
      .should("have.text", patientName);
  }

  validateDOB(dob) {
    cy.contains("div.card-key", "DOB")
      .parent("div")
      .find("div.card-item-value")
      .invoke("text")
      .should("include", dob);
  }

  clickNextButton() {
    cy.log('Clicking the "Next" button');
    cy.contains("button.btn", "Next")
      .should("be.enabled")
      .click({ force: true });
  }

  enterQuantity(quantity: string) {
    cy.enterValueInTextField("#quantity", quantity, "Quantity");
  }

  enterQuantityExtended(quantity: string) {
    cy.enterValueInTextField(
      ":nth-child(6) > .wrapper_bar > .d-flex > .w-full",
      quantity,
      "Quantity Extended"
    );
  }

  selectProductFromList(productName: string) {
    cy.log(`Selecting product from list: ${productName}`);
    cy.get('[placeholder="Search products"]').type(productName);
  }

  selectFirstOption(optionText: string) {
    cy.log(`Selecting the first option: ${optionText}`);
    cy.get("select.form-select")
      .should("be.visible")
      .and("have.length.greaterThan", 0);
    cy.get("select.form-select").eq(0).select(optionText);
  }

  validateSelectedOption(optionText: string) {
    cy.log(`Validating the selected option: ${optionText}`);
    cy.get("select.form-select")
      .eq(0)
      .find("option:selected")
      .should("have.text", optionText);
  }

  enterDose(dose: string) {
    cy.enterValueInTextField('[placeholder="Enter Dose"]', dose, "Dose");
  }

  selectFrequency(frequency: string) {
    cy.log(`Selecting frequency: ${frequency}`);
    cy.get('[name="frequency"]')
      .should("be.visible")
      .and("have.length.greaterThan", 0);
    cy.get('[name="frequency"]').eq(0).select(frequency);
  }

  selectFoodInstruction(instruction: string) {
    cy.log(`Selecting food instruction: ${instruction}`);
    cy.get('[name="food"]').eq(0).select(instruction);
  }

  selectGeneralInstruction(instruction: string) {
    cy.log(`Selecting general instruction: ${instruction}`);
    cy.get('[name="instruction"]').eq(0).select(instruction);
  }

  enterStartDate(date: string) {
    cy.log(`Entering start date: ${date}`);
    cy.get("#start_date").clear({ force: true }).type(date, { force: true });
  }

  enterEndDate(date: string) {
    cy.log(`Entering end date: ${date}`);
    cy.get("#end_date").clear({ force: true }).type(date, { force: true });
  }

  clickPrescribe() {
    cy.log('Clicking the "Prescribe" button');
    cy.get('[class="btn-group dropup"]')
      .find('[class="btn btn-primary w-full"]')
      .contains("Prescribe")
      .click({ force: true });
  }

  selectPaperPrescription() {
    cy.log('Selecting "Paper Prescription"');
    cy.get(
      '[class="dropdown-menu dropdown-menu-end min-w-full border-primary show"]'
    )
      .find('[class="dropdown-item"]')
      .contains("Paper Prescription")
      .click({ force: true });
  }
}

export const onNewRxPage = new NewRxPage();
export const onRecipePage = new RecipePage();
export const onPrescriberConsultationPage = new PrescriberConsultationPage();
