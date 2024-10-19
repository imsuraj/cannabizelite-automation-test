export class PatientDashboard {
  successMessageEle = ".container-fluid > span";
  /**
   * validate the success message after saving changes
   * @param expectedMessage - the expected success message
   */
  validateSuccessMessage(expectedMessage: string) {
    cy.contains(this.successMessageEle, expectedMessage);
  }

  /**
   * validate the application status
   * @param status - the expected status
   */
  validateApplicationStatus(status) {
    cy.get(".application_status_badge").should("have.text", status);
  }

  /**
   * validate make payment button is displayed
   */
  validateMakePaymentIsDisplayed() {
    cy.get(".detail-button").should("be.visible");
  }

  clickOnButton(labelName) {
    cy.get(".detail-button")
      .scrollIntoView()
      .should("be.visible")
      .should("not.be.disabled")
      .should("have.text", labelName)
      .click({ force: true });
  }

  /**
   * click on Make Payment button
   */
  clickOnMakePayment() {
    this.clickOnButton("Make Payment");
  }

  /**
   * click on assign doctor
   */
  clickOnAssignDoctor() {
    this.clickOnButton("Assign Doctor");
  }

  /**
   * click on Proceed button
   */
  clickOnProceedButton() {
    cy.contains("div.modal-title", "Payment Details") // Find the modal title containing 'Payment Details'
      .parent() // Traverse to the parent element
      .find("button") // Find the button within this context
      .contains("Proceed") // Ensure it contains the text 'Proceed'
      .click();
  }

  /**
   * click on Skip button
   */
  clickOnSkipButton() {
    cy.contains("button", "Skip").should("be.visible").click({ force: true });
  }
  /**
   * click on Book consulation button
   */

  navigateToBookConsultation() {
    cy.log('Navigating to "Book Consultation"');
    cy.get('a[href="/book-consultation"]').click({ force: true });
  }

  clickOnReschedule() {
    cy.contains("Reschedule").click();
  }
}

export const onPatientDashboard = new PatientDashboard();
