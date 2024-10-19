import { messages } from "../messages";

export class NurseDashboardPage {
  welcomeMessageEle = ".container-fluid > span";
  filterIconEle = '[class="dropdown"]';
  patientIdTextBoxEle = '[placeholder="Enter Patient ID"]';
  patientFullNameTextBoxEle = '[placeholder="Enter Patient Full Name/Email"]';
  applyFilterBtnEle = ".dropdown-menu.show .btn.btn-primary";
  applyFilterBtnLabel = "Apply Filter";
  todayConsultBtnEle = "Today's Consult";
  clearFilterBtnEle = "Clear Filter";
  checkboxEle = {
    listItems: ".calendar-menu-sub-item li",
    checkBox: 'input[type="checkbox"]',
  };
  dateEle = {
    year: ".rdrYearPicker > select",
    month: ".rdrMonthPicker > select",
    day: ".rdrDayNumber > span",
  };

  webTableRowEle = "table tbody tr";
  webTableHeaderEle = "table thead tr th";

  successMessageEle = ".container-fluid > span";

  logoutEle = {
    locator: "button.nav-link",
    labelText: "Logout",
  };

  /**
   * get the welcome message element
   */
  getWelcomeMessage() {
    return cy.get(this.welcomeMessageEle);
  }

  /**
   * click on the filter icon based on the column name
   * @param colName - name of the column to filter
   */
  clickOnFilterIcon(colName) {
    cy.get(this.webTableHeaderEle)
      .contains("span", colName)
      .parent("div")
      .within(() => {
        cy.get(this.filterIconEle).click();
      });
  }

  /**
   * enter the patient ID in the filter input field
   * @param patientId - ID of the patient
   */
  enterPatientId(patientId) {
    cy.get(this.patientIdTextBoxEle).type(patientId);
  }

  /**
   * enter the patient full name in the filter input field
   * @param patientName - full name of the patient
   */
  enterPatientFullName(patientName) {
    cy.get(this.patientFullNameTextBoxEle).type(patientName);
  }

  /**
   * click on the apply filter button
   */
  clickOnApplyFilterButton() {
    cy.get(this.applyFilterBtnEle)
      .contains(this.applyFilterBtnLabel)
      .click({ force: true });
  }

  /**
   * click on the "Today's Consult" button
   */
  clickOnTodaysConsult() {
    cy.contains("a", this.todayConsultBtnEle).click({ force: true });
  }

  /**
   * click on the clear filter button
   */
  clickOnClearFilter() {
    cy.contains(".btn", this.clearFilterBtnEle).click();
  }

  /**
   * click on the review application button based on the provided email
   * @param email - email address of the patient
   */
  clickOnReviewApplicationByEmail(email: string) {
    cy.log(`Reviewing application of patient having email : ${email}`);
    cy.get(this.webTableRowEle)
      .contains("td", email)
      .parent("tr")
      .within(() => {
        cy.get("button").contains("Review Application").click();
      });
  }

  /**
   * click on the review application button based on the provided status
   * @param status - status of the patient
   */
  clickOnReviewApplicationByStatus(status: string) {
    cy.log(`Reviewing application of patient having email : ${status}`);
    cy.get(this.webTableRowEle)
      .contains("td", status)
      .parent("tr")
      .within(() => {
        cy.get("button").contains("Review Application").click();
      });
  }

  /**
   * checks if the personal details icon is displayed
   */
  // put this method in the patient summary po
  checkPersonalDetailsIsDisplayed() {
    return cy
      .get(".main-detail")
      .find(".card-icon")
      .find('img[data-bs-toggle="modal"][data-bs-target="#myModal"]')
      .eq(0)
      .should("be.visible");
  }
  /**
   * function to select checkboxes based on the label text
   * @param labelTexts - array of label texts to match and select
   */
  selectCheckboxByLabel(labelTexts: string[]) {
    // iterate over each label text provided
    labelTexts.forEach((labelText) => {
      // find the list items containing the labels
      cy.get(this.checkboxEle.listItems).each((el) => {
        const label = el.find("label").text().trim();
        if (label === labelText) {
          // if the label matches, select the corresponding checkbox
          cy.wrap(el).find(this.checkboxEle.checkBox).check({ force: true });
        }
      });
    });
  }

  /**
   * select the prescriber checkbox based on the provided prescriber name
   * @param prescriber - name of the prescriber
   */
  selectPrescriber(prescriber: string[]) {
    this.selectCheckboxByLabel(prescriber);
  }

  /**
   * select the application status checkbox based on the provided status
   * @param applicationStatus - status of the application
   */
  selectApplicationStatus(applicationStatus: string[]) {
    this.selectCheckboxByLabel(applicationStatus);
  }

  /**
   * select the month in the calendar dropdown
   * @param month - month to select
   */
  selectMonth(month: string) {
    // click on the month dropdown and select the desired month
    cy.get(this.dateEle.month).select(month);
  }

  /**
   * select the year in the calendar dropdown
   * @param year - year to select
   */
  selectYear(year: string) {
    // click on the year dropdown and select the desired year
    cy.get(this.dateEle.year).select(year);
  }

  /**
   * select the day in the calendar
   * @param day - day to select
   */
  selectDate(day: string) {
    cy.contains(this.dateEle.day, day).click();
  }

  tableColumn = {
    PatientId: 0,
    PatientFullName: 1,
    AssignedPrescriber: 2,
    ConsultationDate: 3,
    ApplicationStatus: 4,
  };

  /**
   * validate data displayed in the web table
   * @param columnIndex - index of the column to validate
   * @param expectedText - expected text to match in the column
   */
  verifyTableColumnText(columnIndex: number, expectedText: string) {
    cy.get(this.webTableRowEle).then((rows) => {
      if (
        rows.length === 1 &&
        rows.text().includes(messages.searchAndFilter.noDataFound)
      ) {
        cy.log(`No data found for patient name: ${expectedText}`);
      } else {
        cy.wrap(rows).each((row) => {
          cy.wrap(row)
            .find("td")
            .eq(columnIndex)
            .invoke("text")
            .then((text) => {
              cy.wrap(text).should("include", expectedText);
            });
        });
      }
    });
  }

  /**
   * verify patient ID in the table
   * @param expectedPatientId - expected patient ID to match
   */
  verifyPatientIdInTable(expectedPatientId: string) {
    this.verifyTableColumnText(
      this.tableColumn.PatientId,
      `#${expectedPatientId}`
    );
  }

  /**
   * verify patient full name in the table
   * @param expectedPatientName - expected patient full name to match
   */
  verifyPatientFullNameInTable(expectedPatientName: string) {
    this.verifyTableColumnText(
      this.tableColumn.PatientFullName,
      expectedPatientName
    );
  }

  /**
   * verify prescriber in the table
   * @param expectedPrescriber - expected prescriber to match
   */
  verifyPrescriberInTable(expectedPrescriber: string) {
    this.verifyTableColumnText(
      this.tableColumn.AssignedPrescriber,
      expectedPrescriber
    );
  }

  /**
   * verify consultation date in the table
   * @param expectedConsultationDate - expected consultation date to match
   */
  verifyConsultationDateInTable(expectedConsultationDate: string) {
    this.verifyTableColumnText(
      this.tableColumn.ConsultationDate,
      expectedConsultationDate
    );
  }

  /**
   * verify application status in the table
   * @param expectedApplicationStatus - expected application status to match
   */
  verifyApplicationStatusInTable(expectedApplicationStatus: string) {
    this.verifyTableColumnText(
      this.tableColumn.ApplicationStatus,
      expectedApplicationStatus
    );
  }

  /**
   * validate the success message after saving changes
   * @param expectedMessage - the expected success message
   */
  validateSuccessMessage(expectedMessage: string) {
    cy.contains(this.successMessageEle, expectedMessage);
  }

  // method to check of logout is displayed
  isLogoutDisplayed(): void {
    cy.contains(this.logoutEle.locator, this.logoutEle.labelText).should(
      "be.visible"
    );
  }

  //method to click on logout link
  clickOnLogoutButton(): void {
    cy.contains(this.logoutEle.locator, this.logoutEle.labelText).click({
      force: true,
    });
  }
  // Method to handle the logout confirmation modal and click the logout button
  confirmLogout(): void {
    cy.get(".modal-content")
      .first()
      .within(() => {
        cy.contains("button", this.logoutEle.labelText).click({ force: true });
      });
  }
}

export const onNurseDashboardPage = new NurseDashboardPage();
