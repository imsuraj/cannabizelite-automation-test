export class PrescriberDashboardPage {
  webTableRowEle = "table tbody tr";

  validatePatientIsDisplayed(email: string) {
    cy.log(`Validating that patient with email: ${email} is displayed`);
    cy.get(this.webTableRowEle).contains("td", email).should("be.visible");
  }

  clickOnTakeAction() {
    cy.contains("Take Action").click();
  }

  clickOnMarkAsMissed() {
    cy.contains("Mark as Missed").click();
  }
}

export const onPrescriberDashboardPage = new PrescriberDashboardPage();
