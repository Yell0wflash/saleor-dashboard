/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import { productTypeDetailsUrl } from "../../../fixtures/urlList";
import { createAttribute } from "../../../support/api/requests/Attribute";
import { createCategory } from "../../../support/api/requests/Category";
import {
  createTypeProduct,
  getProductType
} from "../../../support/api/requests/ProductType";
import { getProductDetails } from "../../../support/api/requests/storeFront/ProductDetails";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import {
  createProductInChannel,
  deleteProductsStartsWith
} from "../../../support/api/utils/products/productsUtils";
import filterTests from "../../../support/filterTests";

filterTests({ definedTags: ["all"] }, () => {
  describe("As an admin I want to manage product types", () => {
    const startsWith = "productType";
    let category;
    let channel;
    let attribute;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteProductsStartsWith(startsWith);
      createAttribute({ name: startsWith }).then(resp => (attribute = resp));
      createCategory(startsWith).then(resp => (category = resp));
      getDefaultChannel().then(resp => (channel = resp));
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
    });

    it("should be able to delete product type. TC: SALEOR_1505", () => {
      const name = `${startsWith}${faker.datatype.number()}`;

      createTypeProduct({ name, hasVariants: false }).then(productType => {
        cy.visitAndWaitForProgressBarToDisappear(
          productTypeDetailsUrl(productType.id)
        )
          .get(BUTTON_SELECTORS.deleteButton)
          .click()
          .addAliasToGraphRequest("ProductTypeDelete")
          .get(SHARED_ELEMENTS.warningDialog)
          .find(BUTTON_SELECTORS.deleteButton)
          .click()
          .waitForRequestAndCheckIfNoErrors("@ProductTypeDelete");
        getProductType(productType.id).should("be.null");
      });
    });

    it("should be able to delete product type with assigned product. TC: SALEOR_1509", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let productType;

      createTypeProduct({ name, hasVariants: false })
        .then(productTypeResp => {
          productType = productTypeResp;
          createProductInChannel({
            name,
            channelId: channel.id,
            categoryId: category.id,
            productTypeId: productType.id
          });
        })
        .then(({ product }) => {
          cy.visitAndWaitForProgressBarToDisappear(
            productTypeDetailsUrl(productType.id)
          )
            .get(BUTTON_SELECTORS.deleteButton)
            .click()
            .addAliasToGraphRequest("ProductTypeDelete")
            .get(SHARED_ELEMENTS.warningDialog)
            .find(BUTTON_SELECTORS.deleteButton)
            .should("not.be.enabled")
            .get(BUTTON_SELECTORS.deleteAssignedItemsConsentCheckbox)
            .click()
            .get(SHARED_ELEMENTS.warningDialog)
            .find(BUTTON_SELECTORS.deleteButton)
            .click()
            .waitForRequestAndCheckIfNoErrors("@ProductTypeDelete");
          getProductType(productType.id).should("be.null");
          getProductDetails(product.id)
            .its("body.data.product")
            .should("be.null");
        });
    });
  });
});
