export class PaymentPage {
  fillPaymentForm(
    firstName: string,
    lastName: string,
    cardNumber: string,
    month: string,
    year: string,
    cvv: string
  ) {
    cy.origin(
      "https://test-gateway.tillpayments.com",
      { args: { firstName, lastName, cardNumber, month, year, cvv } },
      ({ firstName, lastName, cardNumber, month, year, cvv }) => {
        cy.get("#submit_btn").should("be.visible");
        cy.get('input[name="first_name"]').type(firstName);
        cy.get('input[name="last_name"]').type(lastName);

        cy.wait(2000);
        cy.get('iframe[name^="vault-master-"]').then((iframe) => {
          const body = iframe.contents().find("body");
          cy.wrap(body)
            .find('input[name="card_number"]')
            .type(cardNumber, { force: true });
        });
        cy.get("#month").select(month);
        cy.get("#year").select(year);
        cy.get('iframe[name^="vault-slave-"]').then((iframe) => {
          const body = iframe.contents().find("body");
          cy.wrap(body).find('input[name="cvc"]').type(cvv, { force: true });
        });
        cy.get("#submit_btn").click({ force: true });
      }
    );
  }
}

// Export instance
export const onPaymentPage = new PaymentPage();
