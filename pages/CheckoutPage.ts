import { Page, expect } from '@playwright/test';

// Page Object Model for Checkout Page
export class CheckoutPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string) {
        await this.page.fill('[data-test="firstName"]', firstName);
        await this.page.fill('[data-test="lastName"]', lastName);
        await this.page.fill('[data-test="postalCode"]', postalCode);
        await this.page.click('[data-test="continue"]');
    }

    async verifyCheckoutStepOne() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    }

    async verifyCheckoutStepTwo() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
    }

    async finishCheckout() {
        await this.page.click('[data-test="finish"]');
    }

    async verifyCheckoutComplete() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
        await expect(this.page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    }

    async cancelCheckout() {
        await this.page.click('[data-test="cancel"]');
    }

    async getTotalAmount() {
        return await this.page.locator('[data-test="total-label"]').textContent();
    }
}
