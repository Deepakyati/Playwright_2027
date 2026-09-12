import { Page, expect } from '@playwright/test';

// Page Object Model for Inventory Page
export class InventoryPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async addToCart(itemName: string) {
        // Map item names to their data-test attribute values
        const itemMap: { [key: string]: string } = {
            'Sauce Labs Backpack': 'add-to-cart-sauce-labs-backpack',
            'Sauce Labs Bike Light': 'add-to-cart-sauce-labs-bike-light',
            'Sauce Labs Bolt T-Shirt': 'add-to-cart-sauce-labs-bolt-t-shirt',
            'Sauce Labs Fleece Jacket': 'add-to-cart-sauce-labs-fleece-jacket',
            'Sauce Labs Onesie': 'add-to-cart-sauce-labs-onesie',
            'Test.allTheThings() T-Shirt (Red)': 'add-to-cart-test.allthethings()-t-shirt-(red)'
        };
        
        const dataTestId = itemMap[itemName];
        if (dataTestId) {
            await this.page.locator(`[data-test="${dataTestId}"]`).click();
        }
    }

    async removeFromCart(itemName: string) {
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

    async clickCart() {
        await this.page.click('[data-test="shopping-cart-link"]');
    }

    async verifyInventoryPage() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await expect(this.page).toHaveTitle('Swag Labs');
        await expect(this.page.locator('.inventory_item')).toHaveCount(6);
    }

    async getItemCount() {
        return await this.page.locator('.inventory_item').count();
    }

    async logout() {
        await this.page.click('#react-burger-menu-btn');
        await this.page.click('#logout_sidebar_link');
    }
}
