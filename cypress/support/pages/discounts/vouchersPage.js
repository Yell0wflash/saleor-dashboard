import { VOUCHERS_SELECTORS } from "../../../elements/discounts/vouchers";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { urlList } from "../../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../../fixtures/users";
import { createCheckoutWithVoucher } from "../../api/utils/ordersUtils";
import { selectChannelInDetailsPages } from "../channelsPage";

export const discountOptions = {
  PERCENTAGE: VOUCHERS_SELECTORS.percentageDiscountRadioButton,
  FIXED: VOUCHERS_SELECTORS.fixedDiscountRadioButton,
  SHIPPING: VOUCHERS_SELECTORS.shippingDiscountRadioButton
};

export function createVoucher({
  voucherCode,
  voucherValue,
  discountOption,
  channelName,
  usageLimit,
  applyOnePerCustomer,
  onlyStaff,
  minOrderValue,
  minAmountOfItems
}) {
  cy.get(VOUCHERS_SELECTORS.createVoucherButton).click();
  selectChannelInDetailsPages(channelName);
  cy.get(VOUCHERS_SELECTORS.voucherCodeInput)
    .type(voucherCode)
    .get(discountOption)
    .click();
  if (discountOption !== discountOptions.SHIPPING) {
    cy.get(VOUCHERS_SELECTORS.discountValueInputs).type(voucherValue);
  }
  if (usageLimit) {
    cy.get(VOUCHERS_SELECTORS.limits.usageLimitCheckbox)
      .click()
      .type(usageLimit);
  }
  if (applyOnePerCustomer) {
    cy.get(VOUCHERS_SELECTORS.limits.applyOncePerCustomerCheckbox).click();
  }
  if (onlyStaff) {
    cy.get(VOUCHERS_SELECTORS.limits.onlyForStaffCheckbox).click();
  }
  if (minOrderValue) {
    cy.get(VOUCHERS_SELECTORS.requirements.minOrderValueCheckbox)
      .click()
      .get(VOUCHERS_SELECTORS.requirements.minOrderValueInput)
      .type(minOrderValue);
  }
  if (minAmountOfItems) {
    cy.get(VOUCHERS_SELECTORS.requirements.minAmountOfItemsCheckbox)
      .click()
      .get(VOUCHERS_SELECTORS.requirements.minCheckoutItemsQuantityInput)
      .type(minAmountOfItems);
  }
  cy.get(BUTTON_SELECTORS.confirm)
    .click()
    .confirmationMessageShouldDisappear();
}

export function loginAndCreateCheckoutForVoucherWithDiscount({
  discount,
  voucherValue,
  voucherCode,
  channelName,
  dataForCheckout,
  usageLimit,
  applyOnePerCustomer,
  onlyStaff,
  minOrderValue,
  minAmountOfItems
}) {
  cy.clearSessionData()
    .loginUserViaRequest("auth", ONE_PERMISSION_USERS.discount)
    .visit(urlList.vouchers);
  cy.softExpectSkeletonIsVisible();
  createVoucher({
    voucherCode,
    voucherValue,
    discountOption: discount,
    channelName,
    usageLimit,
    applyOnePerCustomer,
    onlyStaff,
    minOrderValue,
    minAmountOfItems
  });
  dataForCheckout.voucherCode = voucherCode;
  return createCheckoutWithVoucher(dataForCheckout);
}
