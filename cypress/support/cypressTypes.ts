import * as utils from "./utils";

declare global {
  namespace Cypress {
    interface Chainable {
      getIframe(iframe: string): Chainable<any>;
      clickOkButton(subject: any): Chainable<any>;
      getIframeBody(): Chainable<any>;
      getCalendlyIframeBody(): Chainable<any>;
      getQuestionBody(questionNumber: any): Chainable<any>;
      getPaymentIframeBody(): Chainable<any>;
      getCalendlyIframeBodyCannabiz();
      enterPaymentDetails(
        firstName: string,
        lastName: string,
        cardNumber: string,
        expMonth: string,
        expYear: string,
        cvv: string
      ): Chainable<Element>;
      login(email: string, password: string): Chainable<any>;
      clickAndSelectDropDownValueForNurseOrDoctor(
        value: string
      ): Chainable<any>;

      enterValueInTextField(
        locator: string,
        value: string,
        labelName: string
      ): Chainable<any>;
      enterValueInTextFieldByLabelName(
        labelName: string,
        locatorName: string,
        value: string
      ): Chainable<any>;
    }
  }
}
