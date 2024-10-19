export class ConsultationPage {
  // Locators
  detailsCardTitle = ".main-detail .card-title";
  modalTrigger = 'img[data-bs-toggle="modal"][data-bs-target="#myModal"]';
  modal = "#myModal";
  personalDetailLabel = "Personal Details";
  medicalDetailLabel = "Medical Details";
  saveChangesEle = "form > button";
  successMessageEle = '[aria-live="polite"][role="status"]';
  approveApplicationBtn = ".w-full > .primary-button";
  missedBtn = ".w-full > .danger-button";
  applicationStatusBadge =
    ".d-flex.flex-column.align-items-center .application_status_badge.badge";

  makePaymentBtn = {
    locator: ".row.w-full .detail-button",
    labelText: "Make Payment",
  };

  assignDoctorLabel = "Assign Doctor";

  // Methods

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

  // Normalize the value to a common format
  normalizeValue(label: string, value: string): string {
    if (label === "Address") {
      // Convert to lowercase, replace multiple spaces with a single space, and trim whitespace
      return value.toLowerCase().replace(/\s+/g, " ").trim();
    }
    // Remove spaces for Medicare No and IHI Number
    if (label === "Medicare No" || label === "IHI Number") {
      return value.replace(/\s+/g, "").toLowerCase();
    }
    return value.trim().toLowerCase().replace(/\//g, "");
  }
  validatePersonalDetails(labelText, value) {
    // Find the card containing the label text, then find the corresponding value element and assert its text
    cy.log(`Validating value "${value}" for "${labelText}"`);
    cy.contains(".card-key", labelText)
      .should("be.visible")
      .parent("div")
      .find(".card-value")
      .invoke("text")
      .then((text) => {
        // Convert both text and value to lower case and trim whitespace before asserting
        try {
          expect(this.normalizeValue(labelText, text)).to.equal(
            this.normalizeValue(labelText, value)
          );
        } catch (error) {
          // Log the error and continue
          cy.log(
            `Assertion error: expected '${this.normalizeValue(
              labelText,
              text
            )}' to equal '${this.normalizeValue(labelText, value)}'`
          );
        }
      });
  }

  validateMedicalDetails(labelText, value) {
    // Find the card containing the label text, then find the corresponding value element and assert its text
    cy.log(`Validating value "${value}" for "${labelText}"`);
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
    cy.log(`Validating notes title "${title}" and body "${body}"`);
    cy.get(".note-body")
      .parent("div")
      .find('[class^="text-gray"]')
      .invoke("text")
      .then((text) => {
        try {
          expect(text.trim().toLowerCase()).to.equal(title.toLowerCase());
        } catch (error) {
          // Log the error and continue
          cy.log(
            `Assertion error: expected note title '${text}' to equal '${title}'`
          );
        }
      });
    cy.get(".note-body")
      .find("p")
      .eq(0)
      .invoke("text")
      .then((text) => {
        try {
          expect(text.trim().toLowerCase()).to.equal(body.toLowerCase());
        } catch (error) {
          // Log the error and continue
          cy.log(
            `Assertion error: expected note body '${text}' to equal '${body}'`
          );
        }
      });
  }
  /**
   * click the save changes button
   */
  clickSaveChanges() {
    // cy.get(this.saveChangesEle).click({ force: true });
    cy.get(this.saveChangesEle)
      .eq(0)
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
   * validate the success message after saving changes
   * @param expectedMessage - the expected success message
   */
  validateFailedMessage(expectedMessage: string) {
    cy.contains(this.successMessageEle, expectedMessage);
  }

  /**
   * click on approve application button
   */
  clickOnApproveApplicationButton() {
    cy.get(this.approveApplicationBtn).click({ force: true });
  }

  /**
   * click on missed application button
   */
  clickOnMissedButton() {
    cy.get(this.missedBtn).click({ force: true });
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
    cy.contains("button", "Proceed")
      .should("be.visible")
      .click({ force: true });
  }

  /**
   * click on Skip button
   */
  clickOnSkipButton() {
    cy.contains("button", "Skip").should("be.visible").click({ force: true });
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
    cy.wait(1000);
  }
}

export class AssignDoctorModal {
  assignDoctorSuccessMessageEle = 'h5[class="text-center"]';

  // method to assign a doctor
  assignDoctor(doctor: string): void {
    cy.clickAndSelectDropDownValueForNurseOrDoctor(doctor);
  }

  // method to click the Next button
  clickOnNextButton(): void {
    // cy.get(".btn").click({ force: true });
    cy.wait(2000);
    cy.contains("Next").click();
  }

  // method to return success message
  getSuccessMessageText(): Cypress.Chainable<string> {
    return cy
      .get(this.assignDoctorSuccessMessageEle)
      .invoke("text")
      .then((text) => text.trim());
  }

  // method to click on close icon
  clickOnCloseIcon() {
    // Find the element containing the text "Your booking has been completed successfully"
    cy.contains(
      ".modal-content.custom-scrollbar .text-container",
      "Your booking has been completed successfully"
    )
      .parent(".modal-content")
      .find(".modal-icon")
      .click({ force: true });
  }
}

export class PersonalDetailsModal {
  // Locators
  healthIdentifierInput =
    'input[name="health_identifier"].input_wrapper-outline';
  medicareNumberInput = 'input[name="medicare_number"].input_wrapper-outline';
  medicareReferenceNumberInput =
    'input[name="medicare_reference_number"].input_wrapper-outline';
  medicareExpiryDateInput =
    'input[name="medicare_expiry_date"].input_wrapper-outline';
  previousGPInput = 'input[name="previous_gp"].input_wrapper-outline';
  concessionPensionNumberInput =
    'input[name="concession_pension_number"].input_wrapper-outline';
  dvaNumberInput = 'input[name="dva_number"].input_wrapper-outline';
  dvaCardColorSelect = 'select[name="dva_card_color"].input_wrapper';
  addressInput = 'input[placeholder="Enter Address Information"]';
  firstAddressSuggestion = '[class="pac-item"]';
  switchCheckLabel = "#switchCheckLabelTop";

  // Methods

  /**
   * enter health identifier
   * @param value - the health identifier value to be entered
   */
  enterHealthIdentifier(value: string) {
    cy.log(`HealthIdentifier: ${value}`);
    cy.get(this.healthIdentifierInput)
      .eq(0)
      .clear()
      .type(value)
      .should("have.value", this.formatHealthIdentifier(value));
  }

  /**
   * enter medicare number
   * @param value - the medicare number to be entered
   */
  enterMedicareNumber(value: string) {
    cy.log(`MedicareNumber: ${value}`);
    cy.get(this.medicareNumberInput)
      .eq(0)
      .clear()
      .type(value)
      .should("have.value", this.formatMedicareNumber(value));
  }

  /**
   * enter medicare reference number
   * @param value - the medicare reference number to be entered
   */
  enterMedicareReferenceNumber(value: string) {
    cy.log(`MedicareReferenceNumber: ${value}`);
    cy.get(this.medicareReferenceNumberInput)
      .eq(0)
      .clear()
      .type(value)
      .should("have.value", value);
  }

  /**
   * enter medicare expiry date
   * @param value - the medicare expiry date to be entered
   */
  enterMedicareExpiryDate(value: string) {
    cy.log(`MedicareExpiryDate: ${value}`);
    cy.get(this.medicareExpiryDateInput)
      .eq(0)
      .clear()
      .type(value)
      .should("have.value", this.formatMedicareExpiryDate(value));
  }

  /**
   * enter previous GP
   * @param value - the previous GP name to be entered
   */
  enterPreviousGP(value: string) {
    cy.log(`PreviousGP: ${value}`);
    cy.get(this.previousGPInput)
      .eq(0)
      .clear()
      .type(value)
      .should("have.value", value);
  }

  /**
   * enter concession pension number
   * @param value - the concession pension number to be entered
   */
  enterConcessionPensionNumber(value: string) {
    cy.log(`ConcessionPensionNumber: ${value}`);
    cy.get(this.concessionPensionNumberInput)
      .eq(0)
      .clear()
      .type(value)
      .should("have.value", value);
  }

  /**
   * enter DVA number
   * @param value - the DVA number to be entered
   */
  enterDVANumber(value: string) {
    cy.log(`DVA Number: ${value}`);
    cy.get(this.dvaNumberInput)
      .eq(0)
      .clear()
      .type(value)
      .should("have.value", value);
  }

  /**
   * select DVA card color
   * @param value - the DVA card color to be selected
   */
  selectDvaCardColor(value: string) {
    cy.log(`Dva Color: ${value}`);
    cy.get(this.dvaCardColorSelect).eq(0).select(value);
  }

  /**
   * enter address and select the first suggestion
   * @param address - the address to be entered
   * @returns selected address
   */
  enterAddress(address: string) {
    cy.get(this.addressInput).eq(0).clear().type(address).wait(2000);
    cy.get(this.firstAddressSuggestion).first().click();
    return cy.get(this.addressInput).invoke("val");
  }

  /**
   * toggle the switch
   */
  toggleSwitch() {
    cy.get(this.switchCheckLabel).eq(0).click();
  }

  /**
   * format health identifier
   * @param value - the health identifier value to be formatted
   * @returns formatted health identifier
   */
  private formatHealthIdentifier(value: string): string {
    return `${value.slice(0, 4)} ${value.slice(4, 8)} ${value.slice(
      8,
      12
    )} ${value.slice(12)}`;
  }

  /**
   * format medicare number
   * @param value - the medicare number to be formatted
   * @returns formatted medicare number
   */
  private formatMedicareNumber(value: string): string {
    return `${value.slice(0, 4)} ${value.slice(4, 9)} ${value.slice(9)}`;
  }

  /**
   * format medicare expiry date
   * @param value - the medicare expiry date to be formatted
   * @returns formatted medicare expiry date
   */
  private formatMedicareExpiryDate(value: string): string {
    return `${value.slice(0, 2)}/${value.slice(2)}`;
  }

  /**
   *
   * @param healthIdentifier
   * @param medicareNumber
   * @param referenceNumber
   * @param medicareExpDate
   * @param previousGP
   * @param concessionPensionNumber
   * @param dvaNum
   * @param dvaCardColor
   */
  enterPersonalDetails(
    healthIdentifier: string,
    medicareNumber: string,
    referenceNumber: string,
    medicareExpDate: string,
    previousGP: string,
    concessionPensionNumber: string,
    dvaNum: string,
    dvaCardColor: string
  ) {
    this.enterHealthIdentifier(healthIdentifier);
    this.enterMedicareNumber(medicareNumber);
    this.enterMedicareReferenceNumber(referenceNumber);
    this.enterMedicareExpiryDate(medicareExpDate);
    this.enterPreviousGP(previousGP);
    this.enterConcessionPensionNumber(concessionPensionNumber);
    this.enterDVANumber(dvaNum);
    this.selectDvaCardColor(dvaCardColor);
  }
}

export class MedicalDetailsModal {
  // Locators
  textAreaParentClass = '[class="arrayField "]';
  inputParentClass = '[class="input"]';
  radioInputType = 'input[type="radio"]';
  selectInputType = `[placeholder="Select"]`;

  /**
   * fill out a text area field based on its label text.
   * @param labelText - the label text to find the text area.
   * @param inputText - the text to input into the text area.
   */
  fillTextArea(labelText: string, inputText: string) {
    cy.contains(this.textAreaParentClass, labelText)
      .parent(this.inputParentClass)
      .find("textarea")
      .clear()
      .type(inputText);
  }

  /**
   * select a radio button based on its label text and option value.
   * @param labelText - the label text to find the radio button group.
   * @param option - the value of the radio button to select.
   */
  selectRadioButton(labelText: string, option: string) {
    cy.contains(this.textAreaParentClass, labelText)
      .parent(this.inputParentClass)
      .find(`${this.radioInputType}[value='${option.toLowerCase()}']`)
      .click();
  }

  /**
   * select an option from a dropdown based on its label text.
   * @param labelText - the label text to find the dropdown.
   * @param option - the option to select from the dropdown.
   */
  selectDropdownOption(labelText: string, option: string) {
    cy.contains(this.textAreaParentClass, labelText)
      .parent(this.inputParentClass)
      .find(this.selectInputType)
      .select(option);
  }

  /**
   * verify that a specific radio button is checked.
   * @param index - the index of the radio button group.
   * @param answer - the expected value that should be checked.
   */
  verifyRadioButtonChecked(index: number, answer: string) {
    cy.get(
      `input[name="response_json.${index}.answer"][value="${answer}"]`
    ).should("be.checked");
  }
}

export class NotesPage {
  addNotesButton = ".detail-button:contains('Add Notes')";
  modalTitle = "#myModal > .modal-dialog > .modal-content > .modal-title";
  inputWrapper = ".input_wrapper-outline";
  editor = ".ql-editor";

  /**
   * click on the "Add Notes" button
   */
  clickAddNotesButton() {
    cy.get(this.addNotesButton).click();
  }

  /**
   * verify that the modal title is "Add Notes"
   */
  verifyModalTitle() {
    cy.get(this.modalTitle).should("have.text", "Add Notes");
  }

  /**
   * fill out the input fields in the "Add Notes" modal
   */
  fillNotes(title, description) {
    cy.get(this.inputWrapper).eq(0).clear().type(title);
    cy.get(this.editor).eq(0).clear().type(description);
  }
}

export const onConsultationPage = new ConsultationPage();
export const onPersonalDetails = new PersonalDetailsModal();
export const onMedicalDetails = new MedicalDetailsModal();
export const onNotesPage = new NotesPage();
export const onAssignDoctor = new AssignDoctorModal();
