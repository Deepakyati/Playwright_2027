import { Page, expect } from '@playwright/test';

// Page Object Model for Shopping Cart Page
export class CartPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async verifyCartPage() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/cart.html');
    }

    async getCartItemCount() {
        return await this.page.locator('.cart_item').count();
    }

    async clickCheckout() {
        await this.page.click('[data-test="checkout"]');
    }

    async removeItem(itemName: string) {
        // Map item names to their data-test attribute values
        const itemMap: { [key: string]: string } = {
            'Sauce Labs Backpack': 'remove-sauce-labs-backpack',
            'Sauce Labs Bike Light': 'remove-sauce-labs-bike-light',
            'Sauce Labs Bolt T-Shirt': 'remove-sauce-labs-bolt-t-shirt',
            'Sauce Labs Fleece Jacket': 'remove-sauce-labs-fleece-jacket',
            'Sauce Labs Onesie': 'remove-sauce-labs-onesie',
            'Test.allTheThings() T-Shirt (Red)': 'remove-test.allthethings()-t-shirt-(red)'
        };
        
        const dataTestId = itemMap[itemName];
        if (dataTestId) {
            await this.page.locator(`[data-test="${dataTestId}"]`).click();
        }
    }

    async continueShopping() {
        await this.page.click('[data-test="continue-shopping"]');
    }
}
